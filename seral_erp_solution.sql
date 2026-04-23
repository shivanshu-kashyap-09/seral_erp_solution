-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 23, 2026 at 04:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seral_erp_solution`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `idempotency_key` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('INIT','PROCESSING','SUCCESS','FAILED','ROLLED_BACK') DEFAULT 'INIT',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `idempotency_key`, `user_id`, `total_amount`, `status`, `created_at`) VALUES
('0a7fb0c8-af68-4b3d-829d-c1def938298c', '04f35968-8429-40ef-a0da-5d00b305e4f9', 1, 2399.98, 'SUCCESS', '2026-04-23 14:14:31'),
('706cf2d5-7f30-413e-a1e1-ab50a2bee15a', '9340315f-045f-42cd-85ed-6e90f58bd3ea', 1, 2399.98, 'SUCCESS', '2026-04-23 14:10:59'),
('973823e0-d1f2-4d08-9ae1-54c6d8e0622b', '4e81332d-88a2-4d19-8755-d7340c390089', 1, 2399.98, 'SUCCESS', '2026-04-23 14:10:50'),
('f8598e74-ca4b-43f8-9fcc-2f4cc967e333', '883fe721-9bdf-44b7-a4bf-7882bfdcba32', 1, 2399.98, 'ROLLED_BACK', '2026-04-23 14:08:59');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_at_time`) VALUES
(3, '973823e0-d1f2-4d08-9ae1-54c6d8e0622b', 1, 2, 599.99),
(4, '973823e0-d1f2-4d08-9ae1-54c6d8e0622b', 2, 1, 1200.00),
(5, '706cf2d5-7f30-413e-a1e1-ab50a2bee15a', 1, 2, 599.99),
(6, '706cf2d5-7f30-413e-a1e1-ab50a2bee15a', 2, 1, 1200.00),
(7, '0a7fb0c8-af68-4b3d-829d-c1def938298c', 1, 2, 599.99),
(8, '0a7fb0c8-af68-4b3d-829d-c1def938298c', 2, 1, 1200.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `stock`, `price`, `created_at`) VALUES
(1, 'Smartphone', 4, 599.99, '2026-04-23 14:03:13'),
(2, 'Laptop', 2, 1200.00, '2026-04-23 14:03:13'),
(3, 'Headphones', 50, 199.99, '2026-04-23 14:03:13'),
(4, 'Limited Edition Watch', 1, 5000.00, '2026-04-23 14:03:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idempotency_key` (`idempotency_key`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
