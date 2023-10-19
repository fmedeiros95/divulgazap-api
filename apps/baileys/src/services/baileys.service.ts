import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, {
  WASocket,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { DevicesService } from './devices.service';

type BaileysSessions = {
  [clientId: string]: WASocket;
};
type BaileysQRCodes = {
  [clientId: string]: string;
};

@Injectable()
export class BaileysService {
  private logger = new Logger(BaileysService.name);
  private sessions: BaileysSessions = {};
  private qrCodes: BaileysQRCodes = {};
  private retriesQrCodeMap = new Map<string, number>();

  constructor(private readonly devicesService: DevicesService) {}

  async initSession(clientId: string) {
    // ** Check if the session already exists
    if (this.sessions[clientId]) {
      this.logger.log(`Session already exists for client ${clientId}`);
      return;
    }

    // ** Fetch the latest version of Baileys
    const { version, isLatest } = await fetchLatestBaileysVersion();
    this.logger.log(`Initializing new Baileys session... Version: ${version} (latest: ${isLatest})`);

    const { state, saveCreds } = await useMultiFileAuthState(`storage/baileys/${clientId}`);
    const client = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      generateHighQualityLinkPreview: false,
      shouldIgnoreJid: jid => isJidBroadcast(jid),
      browser: ['Chat', 'Chrome', '10.15.7'],
    });
    client.ev.on('creds.update', saveCreds);

    // ** Save the client to the sessions object
    this.sessions[clientId] = client;

    // ** Initialize listeners for the client
    this.initListeners(clientId);
  }

  async initListeners(clientId: string) {
    this.logger.log(`Initializing listeners for session ${clientId}...`);

    const client = this.sessions[clientId];
    if (!client) throw new Error(`Client ${clientId} not found`);

    // ** Count retries for QR code scanning
    const retriesQrCode = 0;
  }
}
