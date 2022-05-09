DROP SCHEMA `warzone_app` ;
CREATE SCHEMA `warzone_app` ;
USE `warzone_app` ;

CREATE TABLE user_table (
    uid INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(60) NOT NULL,
    nickname VARCHAR(60) NOT NULL,
    pw_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    account_level TINYINT NOT NULL,
	account_status TINYINT NOT NULL,
    date_modified DATETIME NOT NULL,
    date_creation DATETIME NOT NULL,
    date_last_login DATETIME NOT NULL,
    PRIMARY KEY (uid),
    UNIQUE KEY (username)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 AUTO_INCREMENT=5;


CREATE TABLE blog_info (
    bid INT NOT NULL AUTO_INCREMENT,
    comment_bid INT DEFAULT 0, 
    author_uid INT,
    blog_info VARCHAR(255) NOT NULL,
	blog_status TINYINT NOT NULL,
    blog_location VARCHAR(255) NOT NULL,
    blog_thumbs INT DEFAULT 0,
    date_modified DATETIME NOT NULL,
    date_creation DATETIME NOT NULL,
    PRIMARY KEY (bid),
    FOREIGN KEY (author_uid)
		REFERENCES user_table (uid)		
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 AUTO_INCREMENT=5;

