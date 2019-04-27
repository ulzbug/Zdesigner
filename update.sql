
CREATE TABLE IF NOT EXISTS `directories` (
  `id` smallint(5) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `parent_id` smallint(5) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `directories`
  ADD PRIMARY KEY (`id`);
  
ALTER TABLE `directories`
  MODIFY `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT;
  
ALTER TABLE `schemas` ADD `directory_id` SMALLINT(5) UNSIGNED NOT NULL AFTER `size`;
  

