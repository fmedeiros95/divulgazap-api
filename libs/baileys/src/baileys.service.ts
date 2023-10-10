import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, { WASocket, fetchLatestBaileysVersion, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { filterMessages } from './libs';

type BaileysQRCodes = {
  [clientId: string]: string;
};

type BaileysSessions = {
  [clientId: string]: WASocket;
};

@Injectable()
export class BaileysService {
  private logger = new Logger(BaileysService.name);
  private sessions: BaileysSessions = {};
  private qrCodes: BaileysQRCodes = {};
  private retriesQrCodeMap = new Map<string, number>();

  async createSession(clientId: string) {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    this.logger.log(`Initializing new WhatsApp session... Version: ${version} (latest: ${isLatest})`);

    const { state, saveCreds } = await useMultiFileAuthState(`storage/whatsapp/${clientId}`);
    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      browser: ['Chat', 'Chrome', '10.15.7'],
    });
    sock.ev.on('creds.update', saveCreds);

    // ** Add client to sessions
    this.sessions[clientId] = sock;
  }

  initListener(clientId: string) {
    this.logger.log(`Initializing listeners for session ${clientId}...`);

    const client = this.sessions[clientId];
    if (!client) throw new Error(`Client ${clientId} not found`);

    // ** Total de tentativas de gerar o QRCode
    let retriesQrCode = 0;

    client.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      // ** Gerencia o QRCode
      if (qr !== undefined) {
        if (this.retriesQrCodeMap.get(clientId) && this.retriesQrCodeMap.get(clientId) >= 3) {
          // ** Se o QRCode não for lido em 3 tentativas, encerra a sessão
          delete this.qrCodes[clientId];
          this.retriesQrCodeMap.delete(clientId);

          // ** Encerra a sessão
          client.ev.removeAllListeners('connection.update');
          client.ws.close();

          // ** Remove o cliente da sessão
          delete this.sessions[clientId];
        } else {
          this.logger.log(`Session QRCode Generate ${clientId}`);
          this.retriesQrCodeMap.set(clientId, (retriesQrCode += 1));

          // ** Armazena o QRCode gerado
          this.qrCodes[clientId] = qr;
        }
      }
    });

    client.ev.on('messages.upsert', async messageUpsert => {
      const messages = messageUpsert.messages.filter(filterMessages).map(msg => msg);
      if (!messages) return;

      messages.forEach(async message => {
        this.logger.log(`Message received from ${message.key.remoteJid}`);
        this.logger.debug(JSON.stringify(message));
      });
    });

    client.ev.on('messages.update', async messageUpdate => {
      if (messageUpdate.length === 0) return;

      messageUpdate.forEach(async message => {
        this.logger.log(`Message updated from ${message.key.remoteJid}`);
        this.logger.debug(JSON.stringify(message));

        client.readMessages([message.key]);
      });
    });

    client.ev.on('chats.update', async chatUpdate => {
      if (chatUpdate.length === 0) return;

      chatUpdate.forEach(async chat => {
        this.logger.log(`Chat updated from ${chat.id}`);
        this.logger.debug(JSON.stringify(chat));
      });
    });
  }
}
