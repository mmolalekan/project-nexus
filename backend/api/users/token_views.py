import os
from rest_framework import status
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Get the default response from the parent class
        response = super().post(request, *args, **kwargs)
        data = response.data

        # Set the access and refresh tokens as HTTP-only cookie
        response.set_cookie(
            key='access_token',
            value=data['access'],
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "True").lower() == "true",
            samesite=os.getenv("COOKIE_SAMESITE", "Strict").lower(),
            max_age=settings.ACCESS_TOKEN_LIFETIME,
        )

        response.set_cookie(
            key='refresh_token',
            value=data['refresh'],
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "True").lower() == "true",
            samesite=os.getenv("COOKIE_SAMESITE", "Strict").lower(),
            max_age=settings.REFRESH_TOKEN_LIFETIME,
        )

        # Remove the tokens from the response body
        del data['access']
        del data['refresh']

        return response


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=400)

        # Add the refresh token to the request data
        request.data['refresh'] = refresh_token

        # Get the default response from the parent class
        response = super().post(request, *args, **kwargs)
        data = response.data

        response.set_cookie(
            key='access_token',
            value=data['access'],
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "True").lower() == "true",
            samesite=os.getenv("COOKIE_SAMESITE", "Strict").lower(),
            max_age=settings.ACCESS_TOKEN_LIFETIME,
        )
        response.set_cookie(
            key="refresh_token",
            value=data['refresh'],
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "True").lower() == "true",
            samesite=os.getenv("COOKIE_SAMESITE", "Strict").lower(),
            max_age=settings.REFRESH_TOKEN_LIFETIME,
        )

        del data['access']
        del data['refresh']

        response.data = {
            'message': 'Token refreshed successfully',
            **data
        }

        return response


class TokenValidityCheckView(APIView):
    """
    Checks if the access token is valid and refreshes it if needed.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')

        if not access_token:
            return Response({
                'detail': 'Access token not found',
                'is_valid': False
            }, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Create a new request with the access token
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'

            from rest_framework_simplejwt.authentication import JWTAuthentication
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(access_token)
            user = jwt_auth.get_user(validated_token)

            return Response({
                'detail': 'Token is valid',
                'is_valid': True
            }, status=status.HTTP_200_OK)

        except Exception:
            # Token is invalid or expired, attempt to refresh
            if not refresh_token:
                return Response({
                    'detail': 'Refresh token not found',
                    'is_valid': False
                }, status=status.HTTP_401_UNAUTHORIZED)

            try:
                # Create a new request to the refresh token endpoint
                refresh_request = request._request
                refresh_request.data = {'refresh': refresh_token}

                refresh_view = CustomTokenRefreshView.as_view()
                response = refresh_view(refresh_request)

                if response.status_code == 200:
                    # Copy the cookies from the refresh response
                    final_response = Response({
                        'detail': 'Token refreshed successfully',
                        'is_valid': True
                    }, status=status.HTTP_200_OK)

                    # Copy cookies from the refresh response
                    for cookie in response.cookies.items():
                        final_response.set_cookie(
                            key=cookie[0],
                            value=cookie[1].value,
                            httponly=True,
                            secure=os.getenv(
                                "COOKIE_SECURE", "True").lower() == "true",
                            samesite=os.getenv(
                                "COOKIE_SAMESITE", "Strict").lower(),
                            max_age=settings.REFRESH_TOKEN_LIFETIME if "refresh" in cookie[0]
                            else settings.ACCESS_TOKEN_LIFETIME,
                        )

                    return final_response
                else:
                    return Response({
                        'detail': 'Token refresh failed',
                        'is_valid': False
                    }, status=status.HTTP_401_UNAUTHORIZED)

            except Exception as e:
                return Response({
                    'detail': 'Token refresh failed',
                    'is_valid': False
                }, status=status.HTTP_401_UNAUTHORIZED)
