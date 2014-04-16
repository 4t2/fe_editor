<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2014 Leo Feyer
 *
 * PHP version 5
 * @copyright  Lingo4you 2014
 * @author     Mario Müller <http://www.lingolia.com/>
 * @package    FrontendEditor
 * @license    http://opensource.org/licenses/lgpl-3.0.html
 */


/**
 * Extend default palette
 */
$GLOBALS['TL_DCA']['tl_user']['palettes']['login'] = str_replace(';{session_legend', ',frontendEditor;{session_legend', $GLOBALS['TL_DCA']['tl_user']['palettes']['login']);


/**
 * Add fields to tl_user
 */
$GLOBALS['TL_DCA']['tl_user']['fields']['frontendEditor'] = array
(
	'label'                   => &$GLOBALS['TL_LANG']['tl_user']['frontendEditor'],
	'exclude'                 => true,
	'inputType'               => 'checkbox',
	'eval'                    => array
	(
		'tl_class' =>	'w50'
	),
	'sql'					=> "char(1) NOT NULL default '1'"
);
