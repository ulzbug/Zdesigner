
INSERT INTO `columns` (`id`, `table_id`, `name`, `type`, `size`, `primary_key`, `default_value`, `allow_null`, `foreign_key`) VALUES
(1, 5, 'products_id', 3, '8', 1, '', 0, 0),
(2, 5, 'products_name', 19, '64', 0, '', 0, 0),
(3, 5, 'manufacturers_name', 3, '8', 0, '', 0, 0),
(5, 5, 'products_quantity', 2, '5', 0, '', 0, 0),
(6, 5, 'color_id', 2, '5', 0, '', 0, 0),
(9, 3, 'products_stock_id', 3, '8', 1, '', 0, 0),
(10, 3, 'products_id', 3, '8', 0, '', 0, 0),
(20, 4, 'products_id', 4, '', 1, '', 0, 0),
(21, 5, 'psid', 3, '8', 0, '', 0, 9),
(22, 16, 'retail_website', 2, '', 1, '', 0, 0),
(23, 16, 'owners_id', 4, '', 0, '', 0, 33),
(24, 16, 'retail_website_name', 19, '', 0, '', 0, 0),
(25, 16, 'status', 1, '', 0, '', 0, 0),
(26, 16, 'language_id', 1, '', 0, '', 0, 0),
(27, 16, 'partnership_id', 2, '', 0, '', 0, 0),
(28, 16, 'url', 19, '', 0, '', 0, 0),
(29, 17, 'retail_website', 2, '', 1, '', 0, 22),
(30, 17, 'language_id', 1, '', 1, '', 0, 0),
(31, 17, 'partnership_id', 2, '', 1, '', 0, 0),
(32, 17, 'status', 1, '', 0, '', 0, 0),
(33, 18, 'id', 2, '', 1, '', 0, 0),
(34, 18, 'stock_owner', 19, '', 0, '', 0, 0),
(35, 18, 'affectation_marchandise', 18, '', 0, '', 0, 0),
(36, 19, 'id', 3, '', 1, '', 0, 0),
(37, 19, 'stock_owner_id', 2, '', 0, '', 0, 33),
(38, 19, 'products_stock_id', 3, '', 0, '', 0, 41),
(39, 19, 'size_reference', 19, '', 0, '', 0, 0),
(40, 19, 'products_stock_quantity', 3, '', 0, '', 0, 0),
(41, 20, 'products_stock_id', 3, '', 1, '', 0, 0),
(42, 20, 'products_id', 3, '', 0, '', 0, 49),
(43, 20, 'products_stock_size_id', 2, '', 0, '', 0, 0),
(44, 20, 'products_stock_quantity', 3, '', 0, '', 0, 0),
(45, 20, 'products_stock_quantity_spartoo', 3, '', 0, '', 0, 0),
(46, 20, 'gen_code', 19, '', 0, '', 0, 0),
(47, 20, 'gen_code_logistik', 19, '', 0, '', 0, 0),
(48, 20, 'products_stock_origin', 19, '', 0, '', 0, 0),
(49, 21, 'products_id', 3, '', 1, '', 0, 0),
(50, 21, 'products_type_id', 3, '', 0, '', 0, 70),
(51, 21, 'products_quantity', 3, '', 0, '', 0, 0),
(52, 21, 'products_quantity_spartoo', 3, '', 0, '', 0, 0),
(53, 21, 'products_sex', 18, '', 0, '', 0, 0),
(54, 21, 'products_status', 1, '', 0, '', 0, 0),
(55, 21, 'manufacturers_id', 2, '', 0, '', 0, 72),
(56, 21, 'manufacturers_reference', 19, '', 0, '', 0, 0),
(57, 21, 'photos_find', 1, '', 0, '', 0, 0),
(58, 21, 'color_id', 2, '', 0, '', 0, 0),
(59, 22, 'products_id', 3, '', 1, '', 0, 49),
(60, 22, 'owners_id', 2, '', 1, '', 0, 33),
(61, 22, 'manufacturers_reference', 19, '', 0, '', 0, 0),
(62, 22, 'products_stock_quantity', 3, '', 0, '', 0, 0),
(63, 22, 'products_id_original', 3, '', 0, '', 0, 0),
(64, 23, 'products_id', 3, '', 1, '', 0, 59),
(65, 23, 'owners_id', 2, '', 1, '', 0, 60),
(66, 23, 'language_id', 1, '', 1, '', 0, 0),
(67, 23, 'partnership_id', 2, '', 1, '', 0, 0),
(68, 23, 'products_price', 2, '', 0, '', 0, 0),
(69, 23, 'shipping_price', 7, '', 0, '', 0, 0),
(70, 24, 'products_type_id', 2, '', 1, '', 0, 0),
(71, 24, 'products_type_name', 19, '', 0, '', 0, 0),
(72, 25, 'manufacturers_id', 2, '', 1, '', 0, 0),
(73, 25, 'manufacturers_name', 19, '', 0, '', 0, 0),
(74, 25, 'manufacturers_parent_id', 2, '', 0, '', 0, 0),
(75, 25, 'status', 1, '', 0, '', 0, 0),
(76, 25, 'marketplace', 18, '', 0, '', 0, 0);


INSERT INTO `schemas` (`id`, `name`, `type`, `last_update`) VALUES
(24, 'Products', 2, '2015-07-18 14:30:36'),
(28, 'Marketplace', 2, '2015-07-18 20:11:07');

--
-- Contenu de la table `tables`
--

INSERT INTO `tables` (`id`, `schema_id`, `name`, `pos_x`, `pos_y`) VALUES
(3, 24, 'Products_stock', 582, 283),
(4, 24, 'Products_description', 148, 68),
(5, 24, 'Products', 551, 59),
(16, 28, 'retail_website', 51, 79),
(17, 28, 'retail_website_site', 362, 79),
(18, 28, 'stock_owner', 359, 273),
(19, 28, 'stock_warehouse', 22, 321),
(20, 28, 'products_stock', 359, 420),
(21, 28, 'products', 765, 323),
(22, 28, 'products_owners', 764, 79),
(23, 28, 'products_owners_price', 1178, 79),
(24, 28, 'products_type', 1136, 346),
(25, 28, 'manufacturers', 1137, 466);
