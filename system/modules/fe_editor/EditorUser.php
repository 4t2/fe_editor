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
 * @copyright  Mario Müller 2013
 * @author     Mario Müller <http://www.lingolia.com>
 * @package    Model
 */
class EditorUser extends \User
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
	}

}