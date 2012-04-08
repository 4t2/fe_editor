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

class FrontendEditorHook extends Controller
{
	protected $isActive = false;

	public function __construct()
	{
		if (isset($_COOKIE['BE_USER_AUTH']) && (TL_MODE == 'FE' || defined('EX_TL_MODE_FE')))
		{
			$this->import('EditorUser', 'User');

			if ($this->isActive = $this->User->authenticate())
			{			
				$GLOBALS['TL_CSS'][] = 'system/modules/fe_editor/html/css/fee.css';
				$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/html/js/fee.js';
			}
		}

		parent::__construct();
	}

	public function generatePageHook(Database_Result $objPage, Database_Result $objLayout, PageRegular $objPageRegular)
	{
		if ($this->isActive)
		{
			#die('<pre>'.var_export($objPageRegular, true).'</pre>');
		}
	}

	public function getContentElementHook($objElement, $strBuffer)
	{
		if ($this->isActive && preg_match('~(.*?)(<[a-z]+[^>]*>)(.*)~ism', $strBuffer, $match))
		{
			global $objPage;

			$strClass = 'fe_editor';
			$count = 0;

			$match[2] = preg_replace('~(class="[^"]*)"~iU', '$1 '.$strClass.'"', $match[2], 1, $count);
#die(var_export($objElement, true));

			if ($count < 1)
			{
				$match[2] = str_replace('>', ' class="'.$strClass.'">', $match[2]);
			}
			
			$strToolbar = '<div class="ce_toolbar"><ul><li><img src="system/themes/default/images/settings.gif" width="16" height="16" alt="a"> </li>';
			$strToolbar .= '<li><a href="contao/main.php?do=page&amp;act=edit&amp;id='.$objPage->id.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_page'], $objPage->id).'"><img src="system/themes/default/images/page.gif" width="16" height="16" alt="a"></a></li>';
			$strToolbar .= '<li><a href="contao/main.php?do=article&amp;table=tl_content&amp;id='.$objElement->pid.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_article'], $objElement->pid).'"><img src="system/themes/default/images/article.gif" width="16" height="16" alt="a"></a></li>';
			$strToolbar .= '<li><a href="contao/main.php?do=article&amp;table=tl_content&amp;act=edit&amp;id='.$objElement->id.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_content'], $objElement->id).'"><img src="system/themes/default/images/edit.gif" width="12" height="16" alt="c"></a></li>';
			$strToolbar .= '</ul><p>'.$objElement->type.' ID: '.$objElement->id.'</p></div>';
			
			$strBuffer = $match[1].$match[2].$strToolbar.$match[3];
		}

		return $strBuffer;
	}
}