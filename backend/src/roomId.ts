
interface MacToRoom{
    mac : String;
    roomId : String;
}

const macToRoomList: MacToRoom[] = [
    {mac: "28cdc10d7812", roomId: "EG-3512"},
    {mac: "28cdc10d7814", roomId: "EG-3513"},
    {mac: "28cdc10d7813", roomId: "EG-3504"},
    {mac: "28cdc10d7810", roomId: "EG-2515"},
    {mac: "28cdc10d7811", roomId: "EG-3507"},
    {mac: "28cdc10d780f", roomId: "EG-3511"},
    {mac: "28cdc10d7815", roomId: "EG-3510"},
    {mac: "28cdc10d780e", roomId: "EG-3509"},
]


function getRoomId(macToRoomList: MacRoomMapping[], mac: string): string {
    const mapping = macToRoomList.find(entry => entry.mac === mac);
    return mapping ? mapping.roomId : "MAC address not found";
  }
  
  function main() {
    // Test MAC addresses
    const testMacAddresses = [
      "00:1A:2B:3C:4D:5E",
      "11:22:33:44:55:66",
      "AA:BB:CC:DD:EE:FF",
      "FF:EE:DD:CC:BB:AA",  // Example of a MAC address not in the list
    ];
  
    testMacAddresses.forEach(mac => {
      const roomId = getRoomId(macToRoomList, mac);
      console.log(`The room ID for MAC address ${mac} is: ${roomId}`);
    });
  }
  
  main();
  