import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { fetchTasks, createTask } from '../services/taskService';
import { Task } from '../types';

export function TaskListApiScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      if (currentRequestId === requestIdRef.current) {
        setTasks(data);
      }
    } catch {
      if (currentRequestId === requestIdRef.current) {
        setError('Error al obtener las tareas');
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitError(null);
    try {
      await createTask(title);
      setTitle('');
      await load();
    } catch {
      setSubmitError('Error al crear la tarea');
    }
  };

  return (
    <View className="flex-1 gap-4 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900">Tareas (API)</Text>
      <TextInput
        testID="input-titulo-api"
        placeholder="Escribe el título de la tarea"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        accessibilityLabel="Título de la tarea"
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
      />
      <Pressable
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Guardar tarea"
        className="rounded-lg bg-blue-600 py-3 active:bg-blue-700"
      >
        <Text className="text-center text-base font-semibold text-white">Guardar</Text>
      </Pressable>

      {submitError && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {submitError}
        </Text>
      )}
      {loading && <ActivityIndicator />}
      {error && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </Text>
      )}
      {!loading && !error && tasks.length === 0 && (
        <Text className="py-6 text-center text-base text-gray-500">No hay tareas aún</Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View className="mb-2 rounded-lg border border-gray-200 bg-white p-4">
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}