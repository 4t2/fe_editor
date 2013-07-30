<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2011 Leo Feyer
 *
 * Formerly known as TYPOlight Open Source CMS.
 *
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program. If not, please visit the Free
 * Software Foundation website at <http://www.gnu.org/licenses/>.
 *
 * PHP version 5
 * @copyright  Lingo4you 2013
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
	'eval'                    => array(
		'tl_class' =>	'w50'
	),
	'sql'					=> 'char(1) NOT NULL default \'1\''
);
