import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tasks.db');

const AddTaskScreen = ({ navigation }) => {
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.length === 0) {
      return;
    }
    db.transaction(tx => {
      tx.executeSql('insert into tasks (task, done) values (?, 0)', [task]);
      tx.executeSql('select * from tasks', [], (_, { rows: { _array } }) => {
        console.log(_array);
      });
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add Task" onPress={addTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AddTaskScreen;
