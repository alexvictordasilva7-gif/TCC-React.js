import Clientes from '../../pages/Clientes/Clientes';
import * as S from './Modal.Styled';
import { useState } from 'react';


function Modal({isOpen, children}) {
    
    if(isOpen) {
        return (
            <S.BackModal>
                <S.ModalContent>
                    {children}
                </S.ModalContent>
                    
            </S.BackModal>
        );
    }
    return null;
};

export default Modal;