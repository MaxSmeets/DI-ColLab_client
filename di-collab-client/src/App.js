import { UserProvider } from "./providers/UserProvider";
import { ClientProvider } from "./providers/ClientProvider";
import { RoomProvider } from "./providers/RoomProvider";
import Stack from "./components/Stack";

function App() {
  return (
    <ClientProvider>
      <UserProvider>
        <RoomProvider>
          <Stack />
        </RoomProvider>
      </UserProvider>
    </ClientProvider>
  );
}

export default App;
