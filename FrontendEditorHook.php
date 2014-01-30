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
 * @copyright  Lingo4you 2014
 * @author     Mario Müller <http://www.lingolia.com/>
 * @version    2.1.1
 * @package    FrontendEditor
 * @license    http://opensource.org/licenses/lgpl-3.0.html
 */

class FrontendEditorHook extends \Controller
{
	protected $isActive = false;
	protected $arrParentTables = array
	(
		'tl_boxes4ward_article' => 'boxes4ward'
	);

	protected $strIgnoreClasses;
	protected $arrIgnoreContent;


	public function __construct()
	{
		global $objPage;

		$this->isActive = true;

		$this->strIgnoreClasses = str_ireplace(array(',', '-'), array('|', '\-'), $GLOBALS['TL_CONFIG']['frontendEditorIgnoreClasses']);
		$this->arrIgnoreContent = explode(',', $GLOBALS['TL_CONFIG']['frontendEditorIgnoreContent']);

		parent::__construct();
	}


	public function generatePageHook($objPage, $objLayout, $objPageRegular)
	{
		global $objPage;

		if (!is_array($GLOBALS['TL_CSS']))
		{
			$GLOBALS['TL_CSS'] = array();
		}

		if (!is_array($GLOBALS['TL_JAVASCRIPT']))
		{
			$GLOBALS['TL_JAVASCRIPT'] = array();
		}

		$GLOBALS['TL_CSS'][] = 'system/modules/frontend_editor/assets/styles/fee.css';
		
		if ($GLOBALS['TL_CONFIG']['frontendEditorFramework'] == 'mootools' ||
			($GLOBALS['TL_CONFIG']['frontendEditorFramework'] == 'auto' && (version_compare(VERSION, '3', '<') || $objPage->hasMooTools)))
		{
			$GLOBALS['TL_CSS'][] = 'system/modules/frontend_editor/assets/cerabox/style/cerabox.css';

			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/frontend_editor/assets/cerabox/cerabox.min.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/frontend_editor/assets/scripts/moo_fee.js';
		}
		elseif ($GLOBALS['TL_CONFIG']['frontendEditorFramework'] == 'jquery' || $objPage->hasJQuery)
		{
			if (!defined('TL_ASSETS_URL'))
			{
				define('TL_ASSETS_URL', $GLOBALS['TL_CONFIG']['frontendEditorAssetsUrl']);
			}

			$GLOBALS['TL_CSS'][] = TL_ASSETS_URL.'assets/jquery/colorbox/'. COLORBOX .'/css/colorbox.min.css||static';

			$GLOBALS['TL_JAVASCRIPT'][] = TL_ASSETS_URL.'assets/jquery/colorbox/'. COLORBOX .'/js/colorbox.min.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/frontend_editor/assets/jquery-cookie/jquery.cookie.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/frontend_editor/assets/scripts/jquery_fee.js';
		}
	}

	public function outputFrontendTemplateHook($strContent, $strTemplate)
	{
		if (substr($strTemplate, 0, 3) == 'fe_')
		{
			$strContent = str_ireplace('</head>', '<script type="text/javascript">var request_token="'.(defined('REQUEST_TOKEN')?REQUEST_TOKEN:'').'";</script></head>', $strContent);
		}

		return $strContent;
	}


	public function parseArticlesHook($objTemplate, $arrArticles)
	{
		$objTemplate->text = '<!-- FEE-NEWS '.$objTemplate->id.' '.$objTemplate->pid.' NEWS-FEE -->'.$objTemplate->text;
	}

	public function getContentElementHook($objRow, $strBuffer)
	{
		if (in_array($objRow->type, $this->arrIgnoreContent))
		{
			return $strBuffer;
		}

		if ($objRow->do != '') // from GlobalContentelements
		{
			$feeData = array('do' => $objRow->do);
		}
		elseif ($objRow->ptable != '') // since Contao 3
		{
			if (array_key_exists($objRow->ptable, $this->arrParentTables))
			{
				$feeData = array('do' => $this->arrParentTables[$objRow->ptable]);
			}
			else
			{
				$feeData = array('do' => substr($objRow->ptable, 3));
			}
		}
		else // default
		{
			$feeData = array('do' => 'article');
		}

		$strElements = str_ireplace(',', '|', $GLOBALS['TL_CONFIG']['frontendEditorElements']);

		if ($this->isActive && $feeData !== FALSE && preg_match('~(.*?)(?!<[a-z0-9]+ class="(?:'.$this->strIgnoreClasses.'))(<(?:'.$strElements.')[^>]*>)(.*)~ism', $strBuffer, $match))
		{
			global $objPage;

			if (defined('REQUEST_TOKEN'))
			{
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
			
			$arrButtons = $_SESSION['BE_DATA']['frontendEditorButtons'];

			if (version_compare(VERSION, '3', '<') && in_array('EditNews', $arrButtons) && preg_match('~<!-- FEE-NEWS (\d+) (\d+) NEWS-FEE -->~iU', $match[3], $subMatch))
			{
				$match[3] = str_replace($subMatch[0], '', $match[3]);

				$feeData['do'] = 'news';
				$feeData['news'] = $subMatch[1];
				$feeData['newsArchive'] = $subMatch[2];
				$feeData['newsTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_news'], $subMatch[1]);
				$feeData['newsArchiveTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_news_archive'], $subMatch[2]);
			}
			else
			{
				if (in_array('EditContent', $arrButtons))
				{
					$feeData['content'] = $objRow->id;
					$feeData['contentTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_content'], $objRow->id, $objRow->type);
				}
				
				if (in_array('AddContent', $arrButtons))
				{
					$feeData['contentAddTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_content_add'], $objRow->id);
				}
			}

			if (in_array('EditArticle', $arrButtons))
			{
				$feeData['article'] = $objRow->pid;
				$feeData['articleTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_article'], $objRow->pid);
			}

			if (in_array('EditPage', $arrButtons))
			{
				$feeData['page'] = $objPage->id;
				$feeData['pageTitle'] = sprintf($GLOBALS['TL_LANG']['FEE']['edit_page'], $objPage->id);
			}

			$match[2] = str_replace('>', " data-fee='".json_encode($feeData)."'>", $match[2]);
			
			$strBuffer = $match[1].$match[2].$match[3];
		}

		return $strBuffer;
	}
}