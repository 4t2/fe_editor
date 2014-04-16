<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2014 Leo Feyer
 *
 * PHP version 5
 * @copyright  Lingo4you 2014
 * @author     Mario Müller <http://www.lingolia.com/>
 * @version    2.2.5
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
				$strContent = preg_replace('~<div id="header".*<div id="container"~is', '<div id="container" style="width:766px;margin-left:20px;"', $strContent);
				$strContent = preg_replace('~<div id="left".*<div id="main"~is', '<div id="main" style="margin-left:0; margin-top:0;"', $strContent);
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


	/**
	 * check user settings
	 */
	public function postLoginHook(\BackendUser $objUser)
	{
		$objSession = \Session::getInstance();

		if ($objUser->frontendEditor)
		{
			$arrButtons = array('EditContent', 'EditArticle', 'EditPage', 'EditNews', 'AddContent');
		
			$objSession->set('frontendEditor', $objUser->frontendEditor);

			$arrGroups = $objUser->groups;

			if (!is_null($arrGroups) && is_array($arrGroups))
			{
				$arrGroups[] = '+';
			}
			else
			{
				$arrGroups = array('+');
			}

			if (!$objUser->isAdmin)
			{
				for ($i = count($arrButtons)-1; $i >= 0; $i--)
				{
					if (!in_array($GLOBALS['TL_CONFIG']['frontendEditor'.$arrButtons[$i]], $arrGroups))
					{
						unset($arrButtons[$i]);
					}
				}
			}

			$objSession->set('frontendEditorButtons', $arrButtons);
		}
		else
		{
			$objSession->set('frontendEditor', '');
		}
	}


	public function postLogoutHook(\BackendUser $objUser)
	{
		\Session::getInstance()->set('frontendEditor', '');
	}

}

