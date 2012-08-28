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

class FrontendEditorBackendHook extends Controller
{
	public function parseBackendTemplateHook($strContent, $strTemplate)
	{
		if ($strTemplate == 'be_main')
		{
			if ($this->Input->post('feeHideOnClose') == 1)
			{
				$strContent = '<html><head><title>Close</title></head><body><p>Close</p></body></html>';
			}
			elseif ($this->Input->get('fee') == 1 || $this->Input->post('fee') == 1)
			{
				$strContent = preg_replace('~<div id="header".*<div id="container"~is', '<div id="container" style="width:730px"', $strContent);
				$strContent = preg_replace('~<div id="left".*<div id="main"~is', '<div id="main" style="margin-left:0; margin-top:5px;"', $strContent);
				$strContent = preg_replace('~<div id="footer".*<script~is', '<script', $strContent);
	
				$strContent = preg_replace('~<div id="tl_buttons">.*</div>~isU', '$1', $strContent);
				
				$strContent = preg_replace('~<input[^>]*saveNcreate[^>]*>~', '', $strContent);
				#$strContent = preg_replace('~<input[^>]*saveNback[^>]*>~', '', $strContent);
				$strContent = preg_replace('~<input[^>]*saveNback[^>]*>~', '<input type="hidden" name="feeHideOnClose" value="1">', $strContent);
			}
		}
		
		return $strContent;
	}
}