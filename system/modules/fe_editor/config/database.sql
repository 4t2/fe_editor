-- ********************************************************
-- *                                                      *
-- * IMPORTANT NOTE                                       *
-- *                                                      *
-- * Do not import this file manually but use the Contao  *
-- * install tool to create and maintain database tables! *
-- *                                                      *
-- ********************************************************

-- 
-- Table `tl_user`
-- 

CREATE TABLE `tl_user` (
  `frontendEditor` char(1) NOT NULL default '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
