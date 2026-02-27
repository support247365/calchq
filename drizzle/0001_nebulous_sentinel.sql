CREATE TABLE `zip_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`zip` varchar(10) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(2) NOT NULL,
	`state_name` varchar(50) NOT NULL,
	`county` varchar(100),
	`lat` varchar(20),
	`lng` varchar(20),
	`timezone` varchar(50),
	`utc_offset` int,
	`median_income` int,
	`median_home_value` int,
	CONSTRAINT `zip_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `zip_codes_zip_unique` UNIQUE(`zip`)
);
