<?php

/*
 * @copyright Garrick S. Bodine, 2012
 * @license http://www.gnu.org/licenses/gpl-3.0.txt
 */

class CrowdEd_View_Helper_Flash extends Zend_View_Helper_Abstract {
    
    private $_flashMessenger;

    public function __construct() {
        $this->_flashMessenger = Zend_Controller_Action_HelperBroker::getStaticHelper('FlashMessenger');
    }
    
    public function flash() {
        $flashHtml = '';
        if ($this->_flashMessenger->hasMessages() || $this->_flashMessenger->hasCurrentMessages()) {
            $flashHtml .= '<div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false">';
            $flashHtml .= '<br>';
            $flashHtml .= '<button data-remodal-action="confirm" class="remodal-confirm">OK</button>';
            foreach ($this->_flashMessenger->getMessages() as $status => $messages) {
                foreach ($messages as $message) {
                    $flashHtml .= $this->_getListHtml($status, $message);
                }
            }
            foreach ($this->_flashMessenger->getCurrentMessages() as $status => $messages) {
                foreach ($messages as $message) {
                    $flashHtml .= $this->_getListHtml($status, $message);
                }
            }
            $flashHtml .= '</div>';
        }
        $this->_flashMessenger->clearMessages();
        $this->_flashMessenger->clearCurrentMessages();
        return $flashHtml;
    }
    
    private function _getListHtml($status, $message) {
        return '<li class="' . $this->view->escape($status) . '">' 
            . $this->view->escape($message)
            . '</li>';
    }
}

?>