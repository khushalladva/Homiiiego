<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="Homiiiego.index" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homiiiego — Trusted Services. Simple Booking.</title>
    <meta name="description" content="Find reliable professionals for your home and technical service needs. Search, book and manage your services from one place.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/components.css" rel="stylesheet">
    <link href="assets/css/responsive.css" rel="stylesheet">

</asp:Content>
<asp:Content ID="Content2" runat="server" contentplaceholderid="ContentPlaceHolder2">
    <body>

        <!--<div id="ssNavbar"></div>-->

        <!-- HERO -->
        <section class="hero">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-6">
                        <h1>Trusted Services.<br>
                            Simple Booking.</h1>
                        <p class="lead-2">Find reliable professionals for your home and technical service needs. Search, book and manage your services from one place.</p>

                        <form class="hero-search" id="heroSearchForm">
                            <div class="row g-0 align-items-center">
                                <div class="col-md-4">
                                    <label class="visually-hidden" for="heroService">Service</label>
                                    <input type="text" class="form-control" id="heroService" placeholder="What service do you need?">
                                </div>
                                <div class="col-md-1 d-none d-md-block">
                                    <div class="divider-v"></div>
                                </div>
                                <div class="col-md-3">
                                    <label class="visually-hidden" for="heroLocation">Location</label>
                                    <input type="text" class="form-control" id="heroLocation" placeholder="Enter your location">
                                </div>
                                <div class="col-md-1 d-none d-md-block">
                                    <div class="divider-v"></div>
                                </div>
                                <div class="col-md-2">
                                    <label class="visually-hidden" for="heroCategory">Category</label>
                                    <select class="form-select" id="heroCategory">
                                        <option value="">Category</option>
                                    </select>
                                </div>
                                <div class="col-md-1"></div>
                                <div class="col-12 col-md-auto ms-md-auto mt-2 mt-md-0">
                                    <button type="submit" class="btn btn-primary w-100"><i class="bi bi-search me-1"></i>Find Services</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="col-lg-6">
                        <div class="d-flex flex-column gap-3">
                            <div class="hero-visual-card">
                                <span class="icn" style="background: var(--success-light); color: var(--success);"><i class="bi bi-patch-check-fill"></i></span>
                                <div><strong style="color: var(--dark)">120+ Verified Providers</strong><div class="text-muted-2 small">Background-checked professionals across every category</div>
                                </div>
                            </div>
                            <div class="hero-visual-card">
                                <span class="icn" style="background: var(--primary-light); color: var(--primary);"><i class="bi bi-calendar2-check-fill"></i></span>
                                <div><strong style="color: var(--dark)">Book in Under 2 Minutes</strong><div class="text-muted-2 small">Pick a service, a slot, and you're done</div>
                                </div>
                            </div>
                            <div class="hero-visual-card">
                                <span class="icn" style="background: var(--warning-light); color: #B45309;"><i class="bi bi-star-fill"></i></span>
                                <div><strong style="color: var(--dark)">4.7 Average Rating</strong><div class="text-muted-2 small">From over 2,000 completed bookings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CATEGORIES -->
        <section class="section" id="categories-preview">
            <div class="container">
                <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 section-head-row">
                    <div class="section-head">
                        <span class="eyebrow">Browse by category</span>
                        <h2>Popular Categories</h2>
                        <p>Choose from our most requested service categories</p>
                    </div>
                    <a href="categories.aspx" class="btn btn-light-2">View All Categories</a>
                </div>
                <div class="row g-4" id="homeCategoriesRow"></div>
            </div>
        </section>

        <!-- SERVICES -->
        <section class="section bg-light-2" id="services-preview">
            <div class="container">
                <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 section-head-row">
                    <div class="section-head">
                        <span class="eyebrow">Handpicked for you</span>
                        <h2>Popular Services</h2>
                        <p>Highly rated services booked by customers near you</p>
                    </div>
                    <a href="services.aspx" class="btn btn-light-2">View All Services</a>
                </div>
                <div class="row g-4" id="homeServicesRow"></div>
            </div>
        </section>

        <!-- HOW IT WORKS -->
        <section class="section" id="how-it-works">
            <div class="container">
                <div class="section-head mx-auto text-center">
                    <span class="eyebrow">The process</span>
                    <h2>How It Works</h2>
                    <p class="mx-auto">Booking a service takes just four simple steps</p>
                </div>
                <div class="row g-4">
                    <div class="col-sm-6 col-lg-3">
                        <div class="step-card">
                            <div class="step-num">01</div>
                            <h5>Search</h5>
                            <p>Find the service you need.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="step-card">
                            <div class="step-num">02</div>
                            <h5>Choose</h5>
                            <p>Select the right professional.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="step-card">
                            <div class="step-num">03</div>
                            <h5>Book</h5>
                            <p>Select your preferred date and time.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="step-card">
                            <div class="step-num">04</div>
                            <h5>Relax</h5>
                            <p>Get your service completed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- WHY CHOOSE US -->
        <section class="section bg-light-2">
            <div class="container">
                <div class="section-head mx-auto text-center">
                    <span class="eyebrow">Why Homiiiego</span>
                    <h2>Built Around Trust</h2>
                    <p class="mx-auto">Everything you need to book a service with confidence</p>
                </div>
                <div class="row g-4">
                    <div class="col-sm-6 col-lg-3">
                        <div class="feature-card">
                            <div class="f-icon"><i class="bi bi-patch-check"></i></div>
                            <h5>Verified Professionals</h5>
                            <p>Connect with trusted service providers.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="feature-card">
                            <div class="f-icon"><i class="bi bi-lightning-charge"></i></div>
                            <h5>Easy Booking</h5>
                            <p>Book your service in just a few steps.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="feature-card">
                            <div class="f-icon"><i class="bi bi-tag"></i></div>
                            <h5>Transparent Pricing</h5>
                            <p>Know the estimated price before booking.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="feature-card">
                            <div class="f-icon"><i class="bi bi-chat-square-heart"></i></div>
                            <h5>Customer Reviews</h5>
                            <p>Choose services based on real ratings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PROVIDER CTA -->
        <section class="section">
            <div class="container">
                <div class="provider-cta">
                    <div class="row align-items-center g-4">
                        <div class="col-lg-8">
                            <h2>Grow Your Service Business With Homiiiego</h2>
                            <p class="mb-0">Connect with customers looking for your expertise and manage your bookings from one simple platform.</p>
                        </div>
                        <div class="col-lg-4 text-lg-end">
                            <a href="#" class="btn btn-primary btn-lg">Become a Service Provider</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="section bg-light-2">
            <div class="container">
                <div class="section-head mx-auto text-center">
                    <span class="eyebrow">Customer stories</span>
                    <h2>What Customers Say</h2>
                </div>
                <div class="row g-4" id="testimonialsRow"></div>
            </div>
        </section>

        <!-- CTA -->
        <section class="section">
            <div class="container">
                <div class="cta-band">
                    <h2>Need a Service? Let's Get It Done.</h2>
                    <p>Find trusted professionals and book your next service in minutes.</p>
                    <div class="d-flex gap-3 justify-content-center flex-wrap mt-3">
                        <a href="services.aspx" class="btn btn-light-2 btn-lg">Explore Services</a>
                        <a href="booking.aspx" class="btn btn-lg" style="background: #fff; color: var(--primary); font-weight: 700;">Book a Service</a>
                    </div>
                </div>
            </div>
        </section>


        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="assets/js/mock-data.js"></script>
        <script src="assets/js/main.js"></script>
        <script src="assets/js/services.js"></script>
        <script src="assets/js/pages/index.js"></script>
    </body>
</asp:Content>

