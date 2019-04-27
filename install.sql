
CREATE TABLE IF NOT EXISTS `columns` (
  `id` smallint(5) unsigned NOT NULL,
  `table_id` smallint(5) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  `size` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `primary_key` tinyint(1) NOT NULL,
  `default_value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `allow_null` tinyint(1) unsigned NOT NULL,
  `attributes` ENUM('', 'BINARY','UNSIGNED','UNSIGNED ZEROFILL') NOT NULL, 
  `auto_increment` TINYINT(3) UNSIGNED NOT NULL;
  `foreign_key` smallint(5) unsigned NOT NULL,
  `order_by` tinyint(3) unsigned NOT NULL,
  `comment` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `columns_group` (
  `id` tinyint(3) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `columns_group` (`id`, `name`) VALUES
(1, 'Numeric'),
(2, 'Date'),
(3, 'String'),
(4, 'Binary'),
(5, 'Spatial');

CREATE TABLE IF NOT EXISTS `columns_types` (
  `id` tinyint(3) unsigned NOT NULL,
  `schema_type` tinyint(3) unsigned NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `group` tinyint(3) unsigned NOT NULL,
  `top` tinyint(1) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `columns_types` (`id`, `schema_type`, `name`, `group`, `top`) VALUES
(1, 2, 'Tinyint', 1, 0),
(2, 2, 'Smallint', 1, 0),
(3, 2, 'Mediumint', 1, 0),
(4, 2, 'Int', 1, 1),
(5, 2, 'Bigint', 1, 0),
(6, 2, 'Decimal', 1, 0),
(7, 2, 'Float', 1, 0),
(8, 2, 'Double', 1, 0),
(9, 2, 'Real', 1, 0),
(10, 2, 'Bit', 1, 0),
(11, 2, 'Boolean', 1, 0),
(12, 2, 'Serial', 1, 0),
(13, 2, 'Date', 2, 0),
(14, 2, 'Datetime', 2, 1),
(15, 2, 'Timestamp', 2, 0),
(16, 2, 'Time', 2, 0),
(17, 2, 'Year', 2, 0),
(18, 2, 'Char', 3, 0),
(19, 2, 'Varchar', 3, 0),
(20, 2, 'Tinytext', 3, 0),
(21, 2, 'Text', 3, 1),
(22, 2, 'Mediumtext', 3, 0),
(23, 2, 'Longtext', 3, 0),
(24, 2, 'Enum', 3, 0),
(25, 2, 'Set', 3, 0),
(26, 2, 'Binary', 4, 0),
(27, 2, 'Varbinary', 4, 0),
(28, 2, 'Tinyblob', 4, 0),
(29, 2, 'Mediumblob', 4, 0),
(30, 2, 'Blob', 4, 0),
(31, 2, 'Longblob', 4, 0),
(32, 2, 'Geometry', 5, 0),
(33, 2, 'Point', 5, 0),
(34, 2, 'Linestring', 5, 0),
(35, 2, 'Polygon', 5, 0),
(36, 2, 'Multipoint', 5, 0),
(37, 2, 'Multilinestring', 5, 0),
(38, 2, 'Multipolygon', 5, 0),
(39, 2, 'Geometrycollection', 5, 0);

CREATE TABLE IF NOT EXISTS `connexions` (
  `id` smallint(5) unsigned NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `database` enum('mysql') COLLATE utf8_unicode_ci NOT NULL,
  `host` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `login` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `port` smallint(5) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `schemas` (
  `id` smallint(5) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  `last_update` datetime NOT NULL,
  `read_only` tinyint(3) unsigned NOT NULL,
  `size` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `directory_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `schemas_types` (
  `id` tinyint(3) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `schemas_types` (`id`, `name`) VALUES
(1, 'generic'),
(2, 'mysql');

CREATE TABLE IF NOT EXISTS `tables` (
  `id` smallint(5) unsigned NOT NULL,
  `schema_id` smallint(5) unsigned DEFAULT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `pos_x` smallint(5) unsigned NOT NULL,
  `pos_y` smallint(5) unsigned NOT NULL,
  `comment` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `directories` (
  `id` smallint(5) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `parent_id` smallint(5) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `columns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `type` (`type`);

ALTER TABLE `columns_group`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `columns_types`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `connexions`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `schemas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`);

ALTER TABLE `schemas_types`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `schema_id` (`schema_id`,`name`);

ALTER TABLE `directories`
  ADD PRIMARY KEY (`id`);
  
ALTER TABLE `columns`
  MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=92;

ALTER TABLE `columns_group`
  MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;

ALTER TABLE `columns_types`
  MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;

ALTER TABLE `connexions`
  MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;

ALTER TABLE `schemas`
  MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;

ALTER TABLE `schemas_types`
  MODIFY `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;

ALTER TABLE `tables`
  MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=28;

ALTER TABLE `directories`
  MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT;
  
ALTER TABLE `columns`
  ADD CONSTRAINT `columns_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
  ADD CONSTRAINT `columns_ibfk_2` FOREIGN KEY (`type`) REFERENCES `columns_types` (`id`);

ALTER TABLE `schemas`
  ADD CONSTRAINT `schemas_ibfk_1` FOREIGN KEY (`type`) REFERENCES `schemas_types` (`id`);

ALTER TABLE `tables`
  ADD CONSTRAINT `tables_ibfk_1` FOREIGN KEY (`schema_id`) REFERENCES `schemas` (`id`);
