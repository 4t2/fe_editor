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
		$this->import('EditorUser');

		if ($this->EditorUser->authenticate() && $this->EditorUser->frontendEditor == 1)
		{
			$this->isActive = true;

			if (!is_array($GLOBALS['TL_CSS']))
			{
				$GLOBALS['TL_CSS'] = array();
			}
			$GLOBALS['TL_CSS'][] = 'system/modules/fe_editor/html/css/fee.css';
			$GLOBALS['TL_CSS'][] = 'system/modules/fe_editor/plugins/cerabox/style/cerabox.css';

			if (!is_array($GLOBALS['TL_JAVASCRIPT']))
			{
				$GLOBALS['TL_JAVASCRIPT'] = array();
			}
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/plugins/cerabox/cerabox.min.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/html/js/fee.js';
		}

		parent::__construct();
	}


	public function generatePageHook(Database_Result $objPage, Database_Result $objLayout, PageRegular $objPageRegular)
	{
		if ($this->isActive)
		{
			$mootools = unserialize($objLayout->mootools);
			$mootools[] = 'moo_mediabox';
			$mootools = array_unique($mootools);

			$objLayout->mootools = serialize($mootools);
		}
	}

	public function parseArticlesHook($objTemplate, $arrArticles)
	{
		$objTemplate->text = '<!-- FEE-NEWS '.$objTemplate->id.' '.$objTemplate->pid.' NEWS-FEE -->'.$objTemplate->text;
	}

	public function getContentElementHook($objElement, $strBuffer)
	{
		if ($this->isActive && preg_match('~(.*?)(<[a-z]+[^>]*>)(.*)~ism', $strBuffer, $match))
		{
			global $objPage;

			$strClass = 'fe_editor';
			$count = 0;

			$match[2] = preg_replace('~(class="[^"]*)"~iU', '$1 '.$strClass.'"', $match[2], 1, $count);

			if ($count < 1)
			{
				$match[2] = str_replace('>', ' class="'.$strClass.'">', $match[2]);
			}
			
			$newsArchive = -1;
			
			$strToolbar = '<div class="fee_toolbar"><ul>';
			
			#if (preg_match('~<!-- FEE (.*) FEE -->~iU', $match[3], $subMatch))
			if (preg_match('~<!-- FEE-NEWS (\d+) (\d+) NEWS-FEE -->~iU', $match[3], $subMatch))
			{
				$match[3] = str_replace($subMatch[0], '', $match[3]);
				#$strToolbar .= '<li class="fee_content_edit"><'.$subMatch[1].'></li>';
				$strToolbar .= '<li class="fee_content_edit"><a class="cerabox-content" href="contao/main.php?do=news&amp;table=tl_news&amp;act=edit&amp;id='.$subMatch[1].'&amp;fee=1" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_news'], $subMatch[1]).'"><img src="system/modules/fe_editor/html/images/pencil.png" width="16" height="16" alt="c"></a></li>';
				$newsArchive = $subMatch[2];
			}
			else
			{
				$strToolbar .= '<li class="fee_content_edit"><a class="cerabox-content" href="contao/main.php?do=article&amp;table=tl_content&amp;act=edit&amp;id='.$objElement->id.'&amp;fee=1" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_content'], $objElement->id).'"><img src="system/modules/fe_editor/html/images/pencil.png" width="16" height="16" alt="c"></a></li>';
			}

			$strToolbar .= '<li class="fee_article_edit"><a class="cerabox" href="contao/main.php?do=article&amp;table=tl_content&amp;id='.$objElement->pid.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_article'], $objElement->pid).'"><img src="system/modules/fe_editor/html/images/page_white_edit.png" width="16" height="16" alt="a"></a></li>';
			$strToolbar .= '<li class="fee_page_edit"><a class="cerabox" href="contao/main.php?do=page&amp;act=edit&amp;id='.$objPage->id.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_page'], $objPage->id).'"><img src="system/modules/fe_editor/html/images/page_edit.png" width="16" height="16" alt="p"></a></li>';
			
			if ($newsArchive > -1)
			{
				$strToolbar .= '<li class="fee_news_edit"><a class="cerabox" href="contao/main.php?do=news&amp;table=tl_news&amp;id='.$newsArchive.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_news_archive'], $newsArchive).'"><img src="system/modules/fe_editor/html/images/script_edit.png" width="16" height="16" alt="c"></a></li>';
			}
			else
			{
				$strToolbar .= '<li class="fee_content_add"><a class="cerabox" href="contao/main.php?do=article&amp;table=tl_content&amp;act=create&amp;mode=1&amp;pid='.$objElement->id.'&amp;id='.$objElement->pid.'" title="'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_content_add'], $objElement->id).'"><img src="system/modules/fe_editor/html/images/pencil_add.png" width="16" height="16" alt="+"></a></li>';
			}
			
			$strToolbar .= '</ul><p>'.sprintf($GLOBALS['TL_LANG']['FEE']['edit_content'], $objElement->id).'</p></div>';

			$strBuffer = $match[1].$match[2].$strToolbar.$match[3];
		}

		return $strBuffer;
	}
}