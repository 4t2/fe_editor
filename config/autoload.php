<?php

/**
 * Contao Open Source CMS
 * 
 * Copyright (C) 2005-2014 Leo Feyer
 * 
 * @package frontend_editor
 * @link    http://contao.org
 * @license http://www.gnu.org/licenses/lgpl-3.0.html LGPL
 */


/**
 * Register the classes
 */
ClassLoader::addClasses(array
(
	'FrontendEditorHook'        => 'system/modules/frontend_editor/classes/FrontendEditorHook.php',
	'FrontendEditorBackendHook' => 'system/modules/frontend_editor/classes/FrontendEditorBackendHook.php'
));
