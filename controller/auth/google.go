package auth

import (
    "context"
    "errors"
    "fmt"
    "github.com/gin-contrib/sessions"
    "github.com/gin-gonic/gin"
    "github.com/songquanpeng/one-api/common/config"
    "github.com/songquanpeng/one-api/controller"
    "github.com/songquanpeng/one-api/model"
    "golang.org/x/oauth2"
    "net/http"
    "strconv"
    googleOauth2 "google.golang.org/api/oauth2/v2"
)

func getGoogleOAuthConfig() *oauth2.Config {
    return &oauth2.Config{
        ClientID:     config.GoogleClientId,
        ClientSecret: config.GoogleClientSecret,
        RedirectURL:  config.GoogleRedirectUri,
        Scopes: []string{
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        },
        Endpoint: oauth2.Endpoint{
            AuthURL:  "https://accounts.google.com/o/oauth2/auth",
            TokenURL: "https://oauth2.googleapis.com/token",
        },
    }
}

func getGoogleUserInfoByCode(code string) (*googleOauth2.Userinfo, error) {
    if code == "" {
        return nil, errors.New("无效的参数")
    }
    googleOAuthConfig := getGoogleOAuthConfig()
    //log.Printf("Google OAuth Config: %+v\n", googleOAuthConfig)
    token, err := googleOAuthConfig.Exchange(context.Background(), code)
    if err != nil {
        return nil, fmt.Errorf("无法交换 token: %v", err)
    }
    client := googleOAuthConfig.Client(context.Background(), token)
    oauth2Service, err := googleOauth2.New(client)
    if err != nil {
        return nil, fmt.Errorf("无法创建 OAuth2 服务: %v", err)
    }
    userinfo, err := oauth2Service.Userinfo.Get().Do()
    if err != nil {
        return nil, fmt.Errorf("无法获取用户信息: %v", err)
    }
    return userinfo, nil
}

func GoogleOAuth(c *gin.Context) {
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
        GoogleBind(c)
        return
    }

    if !config.GoogleOAuthEnabled {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": "管理员未开启通过 Google 登录以及注册",
        })
        return
    }
    code := c.Query("code")
    googleUser, err := getGoogleUserInfoByCode(code)
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }
    user := model.User{
        GoogleId: googleUser.Id,
    }
    if model.IsGoogleIdAlreadyTaken(user.GoogleId) {
        err := user.FillUserByGoogleId()
        if err != nil {
            c.JSON(http.StatusOK, gin.H{
                "success": false,
                "message": err.Error(),
            })
            return
        }
    } else {
        if config.RegisterEnabled {
            user.Username = "google_" + strconv.Itoa(model.GetMaxUserId()+1)
            if googleUser.Name != "" {
                user.DisplayName = googleUser.Name
            } else {
                user.DisplayName = "Google User"
            }
            user.Email = googleUser.Email
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

func GoogleBind(c *gin.Context) {
    if !config.GoogleOAuthEnabled {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": "管理员未开启通过 Google 登录以及注册",
        })
        return
    }
    code := c.Query("code")
    googleUser, err := getGoogleUserInfoByCode(code)
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": err.Error(),
        })
        return
    }
    user := model.User{
        GoogleId: googleUser.Id,
    }
    if model.IsGoogleIdAlreadyTaken(user.GoogleId) {
        c.JSON(http.StatusOK, gin.H{
            "success": false,
            "message": "该 Google 账户已被绑定",
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
    user.GoogleId = googleUser.Id
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