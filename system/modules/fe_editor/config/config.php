<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2010 Leo Feyer
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
 * Hooks
 */
if (isset($_COOKIE['BE_USER_AUTH']) && (TL_MODE == 'FE' || !empty($_GET['export'])))
{
	if (version_compare(VERSION, '3', '<'))
	{
		$GLOBALS['TL_HOOKS']['parseArticles'][] = array('FrontendEditorHook', 'parseArticlesHook');
	}

	$GLOBALS['TL_HOOKS']['getContentElement'][] = array('FrontendEditorHook', 'getContentElementHook');
	#$GLOBALS['TL_HOOKS']['outputFrontendTemplate'][] = array('FrontendEditorHook', 'outputFrontendTemplateHook');
}

if (TL_MODE == 'BE')
{
	$GLOBALS['TL_HOOKS']['parseBackendTemplate'][] = array('FrontendEditorBackendHook', 'parseBackendTemplateHook');
}
