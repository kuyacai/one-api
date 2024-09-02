package common

import (
    "os"
    "time"
    "github.com/dgrijalva/jwt-go"
    "github.com/joho/godotenv"
    "log"
)

var jwtKey []byte

func init() {
    // Load .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    // Get the JWT secret key from the environment variable
    jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))
}

type Claims struct {
    Username string `json:"username"`
    Role     int    `json:"role"`
    Id       int    `json:"id"`
    Status   int    `json:"status"`
    jwt.StandardClaims
}

// GenerateJWT generates a new JWT token for a given user
func GenerateJWT(username string, role, id, status int) (string, error) {
   	expirationTime := time.Now().Add(30 * 24 * time.Hour)//30天有效期
    claims := &Claims{
        Username: username,
        Role:     role,
        Id:       id,
        Status:   status,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}

// ValidateJWT validates a given JWT token and returns the claims if valid
func ValidateJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        return nil, err
    }

    return claims, nil
}

// ValidateJWT validates a given JWT token and returns the claims if valid
// and a new token if the validation is successful
func ValidateJWTWithNewToken(tokenString string) (*Claims, string, error) {
    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        return nil, "", err
    }

    // Generate a new token
    newToken, err := GenerateJWT(claims.Username, claims.Role, claims.Id, claims.Status)
    if err != nil {
        return nil, "", err
    }

    return claims, newToken, nil
}