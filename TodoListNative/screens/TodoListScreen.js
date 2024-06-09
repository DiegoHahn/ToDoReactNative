import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Checkbox, FAB } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tasks.db');

const TodoListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists tasks (id integer primary key not null, task text, done int);'
      );
      tx.executeSql('select * from tasks', [], (_, { rows: { _array } }) => {
        setTasks(_array);
      });
    });
  }, []);

  const toggleTaskDone = (id, done) => {
    db.transaction(tx => {
      tx.executeSql('update tasks set done = ? where id = ?', [done ? 1 : 0, id]);
      tx.executeSql('select * from tasks', [], (_, { rows: { _array } }) => {
        setTasks(_array);
      });
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Checkbox
        status={item.done ? 'checked' : 'unchecked'}
        onPress={() => toggleTaskDone(item.id, !item.done)}
      />
      <Text style={item.done ? styles.taskDone : styles.task}>{item.task}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  task: {
    fontSize: 18,
  },
  taskDone: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default TodoListScreen;
