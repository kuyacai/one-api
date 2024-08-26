package auth

import (
    "bytes"
    "encoding/json"
    "errors"
    "github.com/gin-contrib/sessions"
    "github.com/gin-gonic/gin"
    "github.com/songquanpeng/one-api/common/config"
    "github.com/songquanpeng/one-api/common/logger"
    "github.com/songquanpeng/one-api/controller"
    "github.com/songquanpeng/one-api/model"
    "github.com/dgrijalva/jwt-go"
    "net/http"
    "strconv"
    "time"
)

type AppleOAuthResponse struct {
    AccessToken string `json:"access_token"`
    IdToken     string `json:"id_token"`
}

type AppleUser struct {
    Sub   string `json:"sub"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func getAppleUserInfoByCode(code string) (*AppleUser, error) {
    if code == "" {
        return nil, errors.New("无效的参数")
    }
    values := map[string]string{
        "client_id":     config.AppleClientId,
        "client_secret": config.AppleClientSecret,
        "code":          code,
        "grant_type":    "authorization_code",
        "redirect_uri":  config.AppleRedirectUri,
    }
    jsonData, err := json.Marshal(values)
    if err != nil {
        return nil, err
    }
    req, err := http.NewRequest("POST", "https://appleid.apple.com/auth/token", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, err
    }
    req.Header.Set("Content-Type", "application/json")
    client := http.Client{
        Timeout: 5 * time.Second,
    }
    res, err := client.Do(req)
    if err != nil {
        logger.SysLog(err.Error())
        return nil, errors.New("无法连接至 Apple 服务器，请稍后重试！")
    }
    defer res.Body.Close()
    var oAuthResponse AppleOAuthResponse
    err = json.NewDecoder(res.Body).Decode(&oAuthResponse)
    if err != nil {
        return nil, err
    }
    // Decode the ID token to get user info
    claims := jwt.MapClaims{}
    _, _, err = new(jwt.Parser).ParseUnverified(oAuthResponse.IdToken, claims)
    if err != nil {
        return nil, err
    }
    appleUser := &AppleUser{
        Sub:   claims["sub"].(string),
        Name:  claims["name"].(string),
        Email: claims["email"].(string),
    }
    if appleUser.Sub == "" {
        return nil, errors.New("返回值非法，用户字段为空，请稍后重试！")
    }
    return appleUser, nil
}

func AppleOAuth(c *gin.Context) {
    session := sessions.Default(c)
    state := c.Query("state")
    if state == "" || session.Get("oauth_state") == nil || state != session.Get("oauth_state").(string) {
        c.JSON(http.StatusForbidden, gin.H{
            "success": false,
            "message": "state is empty or not same",
        })
        return
    }
    username := session.Get("username")
    if username != nil {
        AppleBind(c)
        return
    }

    if !config.AppleOAuthEnabled {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": "管理员未开启通过 Apple 登录以及注册",
        })
        return
    }
    code := c.Query("code")
    appleUser, err := getAppleUserInfoByCode(code)
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }
    user := model.User{
        AppleId: appleUser.Sub,
    }
    if model.IsAppleIdAlreadyTaken(user.AppleId) {
        err := user.FillUserByAppleId()
        if err != nil {
            c.JSON(http.StatusOK, gin.H{
                "success": false,
                "message": err.Error(),
            })
            return
        }
    } else {
        if config.RegisterEnabled {
            user.Username = "apple_" + strconv.Itoa(model.GetMaxUserId()+1)
            if appleUser.Name != "" {
                user.DisplayName = appleUser.Name
            } else {
                user.DisplayName = "Apple User"
            }
            user.Email = appleUser.Email
            user.Role = model.RoleCommonUser
            user.Status = model.UserStatusEnabled

            if err := user.Insert(0); err != nil {
                c.JSON(http.StatusOK, gin.H{
                    "success": false,
                    "message": err.Error(),
                })
                return
            }
        } else {
            c.JSON(http.StatusOK, gin.H{
                "success": false,
                "message": "管理员关闭了新用户注册",
            })
            return
        }
    }

    if user.Status != model.UserStatusEnabled {
        c.JSON(http.StatusOK, gin.H{
            "message": "用户已被封禁",
            "success": false,
        })
        return
    }
    controller.SetupLogin(&user, c)
}

func AppleBind(c *gin.Context) {
    if !config.AppleOAuthEnabled {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": "管理员未开启通过 Apple 登录以及注册",
        })
        return
    }
    code := c.Query("code")
    appleUser, err := getAppleUserInfoByCode(code)
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }
    user := model.User{
        AppleId: appleUser.Sub,
    }
    if model.IsAppleIdAlreadyTaken(user.AppleId) {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": "该 Apple 账户已被绑定",
        })
        return
    }
    session := sessions.Default(c)
    id := session.Get("id")
    user.Id = id.(int)
    err = user.FillUserById()
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }
    user.AppleId = appleUser.Sub
    err = user.Update(false)
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }
    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "bind",
    })
    return
}
