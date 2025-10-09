// screens/ProfileScreen.tsx
import React, { useState } from "react";
import {
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { profileStyles } from "../styles/profile_styles";

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleSave = () => {
    Alert.alert(
      "Profile Saved",
      `Name: ${name}\nAge: ${age}\nGender: ${gender}\nWeight: ${weight}kg\nHeight: ${height}cm`
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={profileStyles.header}>Profile</Text>

      <Text style={profileStyles.label}>Name</Text>
      <TextInput
        style={profileStyles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={profileStyles.label}>Age</Text>
      <TextInput
        style={profileStyles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
        keyboardType="numeric"
      />

      <Text style={profileStyles.label}>Gender</Text>
      <TextInput
        style={profileStyles.input}
        value={gender}
        onChangeText={setGender}
        placeholder="Enter your gender"
      />

      <Text style={profileStyles.label}>Weight (kg)</Text>
      <TextInput
        style={profileStyles.input}
        value={weight}
        onChangeText={setWeight}
        placeholder="Enter your weight"
        keyboardType="numeric"
      />

      <Text style={profileStyles.label}>Height (cm)</Text>
      <TextInput
        style={profileStyles.input}
        value={height}
        onChangeText={setHeight}
        placeholder="Enter your height"
        keyboardType="numeric"
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Save Profile" onPress={handleSave} color="#2196F3" />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
