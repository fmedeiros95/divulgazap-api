import { WAMessage, WAMessageStubType } from '@whiskeysockets/baileys';

export const filterMessages = (msg: WAMessage): boolean => {
  if (msg.message?.protocolMessage) return false;

  if (
    [
      WAMessageStubType.REVOKE,
      WAMessageStubType.E2E_DEVICE_CHANGED,
      WAMessageStubType.E2E_IDENTITY_CHANGED,
      WAMessageStubType.CIPHERTEXT,
    ].includes(msg.messageStubType)
  )
    return false;

  return true;
};
