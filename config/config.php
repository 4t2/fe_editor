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


$GLOBALS['TL_CONFIG']['frontendEditorFramework'] = 'auto';
$GLOBALS['TL_CONFIG']['frontendEditorReload'] = '1';
$GLOBALS['TL_CONFIG']['frontendEditorElements'] = 'div,section,nav,pre,ol,ul,dl,figure,table';
$GLOBALS['TL_CONFIG']['frontendEditorIgnoreClasses'] = 'no-no,no-fe';

$GLOBALS['TL_CONFIG']['frontendEditorEditContent'] = '+';
$GLOBALS['TL_CONFIG']['frontendEditorEditNews'] = '+';
$GLOBALS['TL_CONFIG']['frontendEditorEditArticle'] = '+';
$GLOBALS['TL_CONFIG']['frontendEditorEditPage'] = '+';
$GLOBALS['TL_CONFIG']['frontendEditorAddContent'] = '+';

/**
 * Hooks
 */
if (isset($_COOKIE['BE_USER_AUTH']) && !empty($_SESSION['BE_DATA']['frontendEditor']) && !empty($_SESSION['BE_DATA']['frontendEditorButtons']) && (TL_MODE == 'FE' || !empty($_GET['export'])))
{
	if (version_compare(VERSION, '3', '<'))
	{
		$GLOBALS['TL_HOOKS']['parseArticles'][] = array('FrontendEditorHook', 'parseArticlesHook');
	}

	$GLOBALS['TL_HOOKS']['getContentElement'][] = array('FrontendEditorHook', 'getContentElementHook');
}

if (TL_MODE == 'BE')
{
	$GLOBALS['TL_HOOKS']['parseBackendTemplate'][] = array('FrontendEditorBackendHook', 'parseBackendTemplateHook');
	$GLOBALS['TL_HOOKS']['outputBackendTemplate'][] = array('FrontendEditorBackendHook', 'outputBackendTemplate');
}
