<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2012 Leo Feyer
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
 * @copyright  Leo Feyer 2005-2012
 * @author     Leo Feyer <http://www.contao.org>
 * @package    Backend
 * @license    LGPL
 * @filesource
 */


/**
 * Class EditorUser
 *
 * Provide methods to manage back end users.
 * @copyright  Leo Feyer 2005-2012
 * @author     Leo Feyer <http://www.contao.org>
 * @package    Model
 */
class EditorUser extends User
{

	/**
	 * Current object instance (do not remove)
	 * @var object
	 */
	protected static $objInstance;

	/**
	 * Name of the corresponding table
	 * @var string
	 */
	protected $strTable = 'tl_user';

	/**
	 * Name of the current cookie
	 * @var string
	 */
	protected $strCookie = 'BE_USER_AUTH';

	/**
	 * Allowed excluded fields
	 * @var array
	 */
	protected $alexf = array();


	/**
	 * Initialize the object
	 */
	protected function __construct()
	{
		parent::__construct();

		$this->strIp = $this->Environment->ip;
		$this->strHash = $this->Input->cookie($this->strCookie);
	}

	/**
	 * Set all user properties from a database record
	 */
	protected function setUserFromDb()
	{
		$this->intId = $this->id;

		// Unserialize values
		foreach ($this->arrData as $k=>$v)
		{
			if (!is_numeric($v))
			{
				$this->$k = deserialize($v);
			}
		}

		$GLOBALS['TL_LANGUAGE'] = $this->language;
		$GLOBALS['TL_USERNAME'] = $this->username;

		$GLOBALS['TL_CONFIG']['showHelp'] = $this->showHelp;
		$GLOBALS['TL_CONFIG']['useRTE'] = $this->useRTE;
		$GLOBALS['TL_CONFIG']['useCE'] = $this->useCE;
		$GLOBALS['TL_CONFIG']['thumbnails'] = $this->thumbnails;
		$GLOBALS['TL_CONFIG']['backendTheme'] = $this->backendTheme;

		// Inherit permissions
		$always = array('alexf');
		$depends = array('modules', 'themes', 'pagemounts', 'alpty', 'filemounts', 'fop', 'forms', 'formp');

		// HOOK: Take custom permissions
		if (is_array($GLOBALS['TL_PERMISSIONS']) && !empty($GLOBALS['TL_PERMISSIONS']))
		{
		    $depends = array_merge($depends, $GLOBALS['TL_PERMISSIONS']);
		}

		// Overwrite user permissions if only group permissions shall be inherited
		if ($this->inherit == 'group')
		{
			foreach ($depends as $field)
			{
				$this->$field = array();
			}
		}

		// Merge permissions
		$inherit = in_array($this->inherit, array('group', 'extend')) ? array_merge($always, $depends) : $always;
		$time = time();

		foreach ((array) $this->groups as $id)
		{
			$objGroup = $this->Database->prepare("SELECT * FROM tl_user_group WHERE id=? AND disable!=1 AND (start='' OR start<$time) AND (stop='' OR stop>$time)")
									   ->limit(1)
									   ->execute($id);

			if ($objGroup->numRows > 0)
			{
				foreach ($inherit as $field)
				{
					$value = deserialize($objGroup->$field);

					if (is_array($value))
					{
						$this->$field = array_merge((is_array($this->$field) ? $this->$field : (strlen($this->$field) ? array($this->$field) : array())), $value);
						$this->$field = array_unique($this->$field);
					}
				}
			}
		}

		// Restore session
		if (is_array($this->session))
		{
			$this->Session->setData($this->session);
		}
		else
		{
			$this->session = array();
		}

		// Make sure pagemounts and filemounts are set!
		if (!is_array($this->pagemounts))
		{
			$this->pagemounts = array();
		}
		if (!is_array($this->filemounts))
		{
			$this->filemounts = array();
		}
	}

}