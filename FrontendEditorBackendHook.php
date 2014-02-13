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
 * @version    2.2.2
 * @package    FrontendEditor
 * @license    http://opensource.org/licenses/lgpl-3.0.html
 */

class FrontendEditorBackendHook extends \Controller
{
	public function parseBackendTemplateHook($strContent, $strTemplate)
	{
		if ($strTemplate == 'be_main')
		{
			if ($this->Input->get('fee') == 1 || $this->Input->post('fee') == 1)
			{
				$strContent = preg_replace('~<div id="header".*<div id="container"~is', '<div id="container" style="width:730px"', $strContent);
				$strContent = preg_replace('~<div id="left".*<div id="main"~is', '<div id="main" style="margin-left:0; margin-top:5px;"', $strContent);
				$strContent = preg_replace('~(<div id="footer")~is', '$1 style="display:none"', $strContent);
	
				$strContent = preg_replace('~<div id="tl_buttons">.*</div>~isU', '$1', $strContent);
				
				$strContent = preg_replace('~<input[^>]*saveNcreate[^>]*>~', '', $strContent);
				#$strContent = preg_replace('~<input[^>]*saveNback[^>]*>~', '', $strContent);
				$strContent = preg_replace('~<input[^>]*saveNback[^>]*>~', '<input type="hidden" name="feeHideOnClose" value="1">', $strContent);

				// see https://github.com/4t2/fe_editor/issues/6
				$strContent = preg_replace('~<ul class="easytheme_.*</ul>~isU', '', $strContent);
				$strContent = preg_replace('~<ul id="easy_themes".*</ul>~isU', '', $strContent);
				$strContent = str_replace('<script src="system/modules/easy_themes/html/easy_themes.js"></script>', '', $strContent);
			}

			$strContent = str_replace('</body>', '<script>if (parent.onLoadContaoBackend != undefined) { parent.onLoadContaoBackend("'.$_SERVER['REQUEST_URI'].'", '.($GLOBALS['TL_CONFIG']['frontendEditorReload'] ? 'true' : 'false').'); }</script></body>', $strContent);
		}

		return $strContent;
	}

	public function outputBackendTemplate($strBuffer, $strTemplate)
	{
		$this->import('BackendUser', 'User');
		
		if ($this->User->frontendEditor)
		{
			$arrButtons = array('EditContent', 'EditArticle', 'EditPage', 'EditNews', 'AddContent');
		
			$this->Session->set('frontendEditor', $this->User->frontendEditor);

			$arrGroups = $this->User->groups;

			if (!is_null($arrGroups) && is_array($arrGroups))
			{
				$arrGroups[] = '+';
			}
			else
			{
				$arrGroups = array('+');
			}

			if (!$this->User->isAdmin)
			{
				for ($i = count($arrButtons)-1; $i >= 0; $i--)
				{
					if (!in_array($GLOBALS['TL_CONFIG']['frontendEditor'.$arrButtons[$i]], $arrGroups))
					{
						unset($arrButtons[$i]);
					}
				}
			}

			$this->Session->set('frontendEditorButtons', $arrButtons);
		}
		else
		{
			$this->Session->set('frontendEditor', '');
		}

		return $strBuffer;
	}
}

