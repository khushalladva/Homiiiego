<%@ Page Title="Login — Homiiiego" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="Homiiiego.login" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/components.css" rel="stylesheet">
    <link href="assets/css/responsive.css" rel="stylesheet">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="auth-wrap">
        <div class="auth-visual">
            <a href="index.aspx" class="d-flex align-items-center gap-2 text-white text-decoration-none">
                <span class="brand-icon" style="width: 38px; height: 38px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;"><i class="bi bi-tools"></i></span>
                <span class="fw-display fw-bold fs-4">Homiiiego</span>
            </a>
            <div>
                <p class="quote">"Booking my AC repair was incredibly simple. I found a professional, selected a convenient time and received confirmation within minutes."</p>
            </div>
            <div class="small" style="color: #8B96A8;">&copy; 2026 Homiiiego. All rights reserved.</div>
        </div>

        <div class="auth-form-side">
            <div class="auth-card">
                <h2 class="mb-1">Welcome back</h2>
                <p class="text-muted-2 mb-4">Login to manage your bookings and profile.</p>

                <div id="loginFormContainer">
                    <asp:Label ID="lblMessage" runat="server" Visible="false" CssClass="d-block mb-3 fw-bold"></asp:Label>

                    <div class="mb-3">
                        <label class="form-label-2" for="loginEmail">Email</label>
                        <asp:TextBox ID="loginEmail" runat="server" TextMode="Email" CssClass="form-control" placeholder="you@example.com" ClientIDMode="Static"></asp:TextBox>
                        <div class="invalid-feedback-2">Please enter a valid email address.</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label-2" for="loginPassword">Password</label>
                        <div class="input-icon-group">
                            <i class="bi bi-lock"></i>
                            <asp:TextBox ID="loginPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="Enter your password" ClientIDMode="Static"></asp:TextBox>
                            <button type="button" class="pw-toggle" id="loginPwToggle"><i class="bi bi-eye"></i></button>
                        </div>
                        <div class="invalid-feedback-2">Password must be at least 6 characters.</div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <asp:CheckBox ID="rememberMe" runat="server" CssClass="form-check-input" ClientIDMode="Static" />
                            <label class="form-check-label small" for="rememberMe">Remember Me</label>
                        </div>
                        <a href="forgot-password.aspx" class="small">Forgot Password?</a>
                    </div>
                    
                    <asp:Button ID="loginBtn" runat="server" CssClass="btn btn-primary w-100 btn-lg" Text="Login" ClientIDMode="Static" OnClick="loginBtn_Click" />
                </div>

                <div class="text-center my-4 text-muted-2 small">or continue with</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-light-2 w-100" type="button" onclick="SS.toast('Social login is a frontend placeholder in this demo.', 'info')"><i class="bi bi-google me-2"></i>Google</button>
                </div>

                <p class="text-center mt-4 mb-0 small">Don't have an account? <a href="register.aspx" class="fw-bold">Create one</a></p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/mock-data.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/validation.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/pages/login.js"></script>
</asp:Content>