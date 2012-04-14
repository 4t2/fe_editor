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
 * @copyright  Lingo4you 2012
 * @author     Mario Müller <http://www.lingo4u.de/>
 * @package    FrontendEditor
 * @license    http://opensource.org/licenses/lgpl-3.0.html
 */

/**
 * Hooks
 */

if (isset($_COOKIE['BE_USER_AUTH']) && (TL_MODE == 'FE' || defined('EX_TL_MODE_FE')))
{
	$GLOBALS['TL_HOOKS']['parseArticles'][] = array('FrontendEditorHook', 'parseArticlesHook');
	#$GLOBALS['TL_HOOKS']['generatePage'][] = array('FrontendEditorHook', 'generatePageHook');
	$GLOBALS['TL_HOOKS']['getContentElement'][] = array('FrontendEditorHook', 'getContentElementHook');
}
