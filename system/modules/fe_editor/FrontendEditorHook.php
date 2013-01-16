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

class FrontendEditorHook extends \Controller
{
	protected $isActive = false;

	public function __construct()
	{
		$this->import('EditorUser');

		/* BE_USER_LOGGED_IN ausprobieren!!! */

		if ($this->EditorUser->authenticate() && $this->EditorUser->frontendEditor == 1)
		{
			$this->isActive = true;

			if (!is_array($GLOBALS['TL_CSS']))
			{
				$GLOBALS['TL_CSS'] = array();
			}
			$GLOBALS['TL_CSS'][] = 'system/modules/fe_editor/assets/styles/fee.css';
			$GLOBALS['TL_CSS'][] = 'system/modules/fe_editor/assets/cerabox/style/cerabox.css';

			if (!is_array($GLOBALS['TL_JAVASCRIPT']))
			{
				$GLOBALS['TL_JAVASCRIPT'] = array();
			}

			if (version_compare(VERSION, '3', '>='))
			{
				$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/assets/cerabox/cerabox.min.js|static';
				$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/assets/scripts/fee_moo.js|static';
			}
			else
			{
				$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/assets/cerabox/cerabox.min.js';
				$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/fe_editor/assets/scripts/fee_moo.js';
			}
		}

		parent::__construct();
	}

	public function outputFrontendTemplateHook($strContent, $strTemplate)
	{
		if (substr($strTemplate, 0, 3) == 'fe_')
		{
			$strContent = str_ireplace('</head>', '<script type="text/javascript">var request_token="'.(defined('REQUEST_TOKEN')?REQUEST_TOKEN:'').'";</script></head>', $strContent);
		}

		return $strContent;
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
		if (version_compare(VERSION, '3', '<'))
		{
			$parentTable = 'tl_article';
		}
		else
		{
			$parentTable = $objElement->ptable;
		}

		if ($this->isActive && in_array($parentTable, array('tl_article', 'tl_news')) && preg_match('~(.*?)(?!<[a-z]+ class="no-no)(<[a-z]+[^>]*>)(.*)~ism', $strBuffer, $match))
		{
			global $objPage;
			
			$feeData = array('table' => substr($parentTable, 3));
			
			if (defined('REQUEST_TOKEN'))
			{
				$rt = '&amp;rt='.REQUEST_TOKEN;
				$feeData['rt'] = REQUEST_TOKEN;
			}
			else
			{
				$rt = '';
			}

			$strClass = 'fe_editor';
			$count = 0;

			$match[2] = preg_replace('~(class="[^"]*)"~iU', '$1 '.$strClass.'"', $match[2], 1, $count);

			if ($count < 1)
			{
				$match[2] = str_replace('>', ' class="'.$strClass.'">', $match[2]);
			}

			$newsArchive = -1;

			$strToolbar = '<div class="no-sc fee_toolbar"><ul>';
			
			if (preg_match('~<!-- FEE-NEWS (\d+) (\d+) NEWS-FEE -->~iU', $match[3], $subMatch))
			{
				$match[3] = str_replace($subMatch[0], '', $match[3]);

				$feeData['table'] = 'news';
				$feeData['news'] = $subMatch[1];
				$feeData['newsArchive'] = $subMatch[2];
				$feeData['newsTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_news'], $subMatch[1]);
				$feeData['newsArchiveTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_news_archive'], $subMatch[2]);
			}
			else
			{				
				$feeData['content'] = $objElement->id;
				$feeData['contentTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_content'], $objElement->id);
				$feeData['contentAddTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_content_add'], $objElement->id);
			}

			$feeData['article'] = $objElement->pid;
			$feeData['articleTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_article'], $objElement->pid);			
			$feeData['page'] = $objPage->id;
			$feeData['pageTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_page'], $objPage->id);

			$match[2] = str_replace('>', " data-fee='".json_encode($feeData)."'>", $match[2]);
			
			$strBuffer = $match[1].$match[2].$match[3];
		}

		return $strBuffer;
	}
}