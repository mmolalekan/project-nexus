from api.users.models import User
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get the access token from the cookie
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return None

        try:
            # Decode the token to validate it
            token = AccessToken(access_token)
            user = User.objects.get(id=token['user_id'])
            return (user, token)
        except Exception as e:
            raise AuthenticationFailed("Invalid or expired token.")

        return None
