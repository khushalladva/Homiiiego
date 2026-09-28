<%@ Page Title="Create Account — Homiiiego" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="register.aspx.cs" Inherits="Homiiiego.register" %>

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
                <span class="brand-icon" style="width:38px;height:38px;background:var(--primary);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                    <i class="bi bi-tools"></i>
                </span>
                <span class="fw-display fw-bold fs-4">Homiiiego</span>
            </a>
            <div>
                <p class="quote">"Verified professionals, transparent pricing, and a booking flow that just works — Homiiiego made getting my home serviced effortless."</p>
            </div>
            <div class="small" style="color:#8B96A8;">&copy; 2026 Homiiiego. All rights reserved.</div>
        </div>

        <div class="auth-form-side">
            <div class="auth-card">
                <h2 class="mb-1">Create your account</h2>
                <p class="text-muted-2 mb-4">Join Homiiiego to start booking trusted professionals.</p>

                <div id="registerFormContainer">
                    <div class="mb-3">
                        <label class="form-label-2" for="regName">Full Name</label>
                        <asp:TextBox ID="regName" runat="server" CssClass="form-control" placeholder="Your full name" ClientIDMode="Static"></asp:TextBox>
                        <div class="invalid-feedback-2">Please enter your full name.</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label-2" for="regEmail">Email</label>
                        <asp:TextBox ID="regEmail" runat="server" TextMode="Email" CssClass="form-control" placeholder="you@example.com" ClientIDMode="Static"></asp:TextBox>
                        <div class="invalid-feedback-2">Please enter a valid email address.</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label-2" for="regPhone">Phone</label>
                        <asp:TextBox ID="regPhone" runat="server" CssClass="form-control" placeholder="+91 90000 00000" ClientIDMode="Static"></asp:TextBox>
                        <div class="invalid-feedback-2">Please enter a valid phone number.</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label-2" for="regPassword">Password</label>
                        <div class="input-icon-group">
                            <i class="bi bi-lock"></i>
                            <asp:TextBox ID="regPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="Create a password" ClientIDMode="Static"></asp:TextBox>
                            <button type="button" class="pw-toggle" id="regPwToggle"><i class="bi bi-eye"></i></button>
                        </div>
                        <div class="pw-strength"><div class="pw-strength-bar" id="pwStrengthBar"></div></div>
                        <div class="small text-muted-2 mt-1" id="pwStrengthLabel"></div>
                        <div class="invalid-feedback-2">Password must contain at least 8 characters.</div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label-2" for="regConfirm">Confirm Password</label>
                        <asp:TextBox ID="regConfirm" runat="server" TextMode="Password" CssClass="form-control" placeholder="Re-enter your password" ClientIDMode="Static"></asp:TextBox>
                        <div class="invalid-feedback-2">Passwords do not match.</div>
                    </div>
                    
                    <div class="form-check mb-4">
                        <asp:CheckBox ID="regTerms" runat="server" CssClass="form-check-input" ClientIDMode="Static" />
                        <label class="form-check-label small" for="regTerms">I agree to the Terms of Service and Privacy Policy</label>
                        <div class="invalid-feedback-2">You must accept the terms to continue.</div>
                    </div>
                    
                    <asp:Button ID="registerBtn" runat="server" CssClass="btn btn-primary w-100 btn-lg" Text="Create Account" ClientIDMode="Static" OnClick="registerBtn_Click" />
                </div>

                <p class="text-center mt-4 mb-0 small">Already have an account? <a href="login.aspx" class="fw-bold">Login</a></p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/mock-data.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/validation.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/pages/register.js"></script>
</asp:Content>