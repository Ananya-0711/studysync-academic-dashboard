from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages


def login_view(request):
    """Handle user login - renders the login/signup page and processes login form."""
    if request.user.is_authenticated:
        return redirect('dashboard_app:home')

    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()

        if not email or not password:
            messages.error(request, 'Please fill in all fields.')
            return render(request, 'auth/login.html', {'active_tab': 'login'})

        user_obj = User.objects.filter(email__iexact=email).first()
        user = None
        if user_obj:
            user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {user.first_name or user.username}!')
            return redirect('dashboard_app:home')
        else:
            messages.error(request, 'Invalid email or password.')
            return render(request, 'auth/login.html', {'active_tab': 'login'})

    return render(request, 'auth/login.html', {'active_tab': 'login'})


def signup_view(request):
    """Handle user registration - processes the signup form."""
    if request.user.is_authenticated:
        return redirect('dashboard_app:home')

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
        confirm_password = request.POST.get('confirm_password', '').strip()

        if not all([first_name, last_name, email, password, confirm_password]):
            messages.error(request, 'Please fill in all fields.')
            return render(request, 'auth/login.html', {'active_tab': 'signup'})

        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'auth/login.html', {'active_tab': 'signup'})

        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
            return render(request, 'auth/login.html', {'active_tab': 'signup'})

        if User.objects.filter(email=email).exists():
            messages.error(request, 'An account with this email already exists.')
            return render(request, 'auth/login.html', {'active_tab': 'signup'})

        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f'{base_username}{counter}'
            counter += 1

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            login(request, user)
            messages.success(request, f'Welcome to StudySync, {first_name}! Your username is: {username}')
            return redirect('dashboard_app:home')
        except Exception as e:
            messages.error(request, f'Something went wrong: {str(e)}')
            return render(request, 'auth/login.html', {'active_tab': 'signup'})

    return render(request, 'auth/login.html', {'active_tab': 'signup'})


def logout_view(request):
    """Handle user logout."""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('auth_app:login')
