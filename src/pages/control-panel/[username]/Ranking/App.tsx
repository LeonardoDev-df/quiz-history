import './App.css';
import { Box } from './Box';
import { Flex } from './Flex';

function App() {
  return (
    <div className="App">
    

      <h1>Pushing Away</h1>

      <Flex container>
        <Flex margin={0.5}>
          <Box bgColor="green" />
        </Flex>
        <Flex margin={0.5}>
          <Box bgColor="green" />
        </Flex>
        <Flex margin={0.5}>
          <Box bgColor="green" />
        </Flex>
        <Flex pushRight margin={0.5}>
          <Box bgColor="red" />
        </Flex>
        <Flex margin={0.5}>
          <Box bgColor="red" />
        </Flex>
      </Flex>

      <h1>Pushed column</h1>
      <Flex container direction="column" height="500px">
        <Flex>
          <Box />
        </Flex>
        <Flex>
          <Box />
        </Flex>
        <Flex pushDown>
          <Box bgColor="red" />
        </Flex>
      </Flex>
    </div>
  );
}

export default App;
