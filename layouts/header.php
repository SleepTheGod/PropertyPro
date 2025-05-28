<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title . ' - ' : ''; ?><?php echo SITE_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://js.stripe.com/v3/"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-building text-blue-600 text-2xl"></i>
                        <span class="ml-2 text-xl font-bold text-gray-900"><?php echo SITE_NAME; ?></span>
                    </div>
                    <?php if (isLoggedIn()): ?>
                        <div class="hidden md:ml-6 md:flex md:space-x-8">
                            <a href="<?php echo SITE_URL; ?>/pages/tenant/dashboard.php" class="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">Dashboard</a>
                            <a href="<?php echo SITE_URL; ?>/pages/tenant/payments.php" class="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">Payments</a>
                            <a href="<?php echo SITE_URL; ?>/pages/tenant/maintenance.php" class="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">Maintenance</a>
                            <a href="<?php echo SITE_URL; ?>/pages/tenant/bulletin.php" class="text-gray-500 hover:text-gray-700 px-1 pt-1 pb-4 text-sm font-medium">Bulletin</a>
                        </div>
                    <?php endif; ?>
                </div>
                <div class="flex items-center space-x-4">
                    <?php if (isLoggedIn()): ?>
                        <span class="text-sm text-gray-700">Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?></span>
                        <a href="<?php echo SITE_URL; ?>/pages/auth/logout.php" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    <?php else: ?>
                        <a href="<?php echo SITE_URL; ?>/pages/auth/login.php" class="text-gray-500 hover:text-gray-700">Login</a>
                        <a href="<?php echo SITE_URL; ?>/pages/auth/register.php" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>
