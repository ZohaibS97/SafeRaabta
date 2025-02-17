import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function ProfileScreen() {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [posts, setPosts] = useState([
    { id: "1", image: "https://via.placeholder.com/150" },
    { id: "2", image: "https://via.placeholder.com/150" },
    { id: "3", image: "https://via.placeholder.com/150" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // **Image Picker Function**
  // **Image Picker Function**
const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need access to your gallery to pick an image.");
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        console.log("Selected Image:", result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      } else {
        console.log("Image selection canceled");
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
    }
  };
  
  // **Upload Image to Firebase Storage**
  const uploadImage = async (uri: string) => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Error", "User not logged in.");
        return;
      }
  
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `profile_pics/${auth.currentUser.uid}/${uuidv4()}`);
      await uploadBytes(fileRef, blob);
  
      const downloadURL = await getDownloadURL(fileRef);
      setProfilePic(downloadURL);
  
      await updateDoc(doc(db, "users", auth.currentUser.uid), { profilePic: downloadURL });
    } catch (error) {
      console.error("Upload Failed:", error);
    }
  };
  

  // **Save Bio**
  const saveBio = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
  
    if (bio.length > 256) {
      alert("Bio cannot exceed 256 characters.");
      return;
    }
  
    setIsEditingBio(false);
    await updateDoc(doc(db, "users", auth.currentUser.uid), { bio });
  };
  

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: profilePic || "https://via.placeholder.com/100" }}
          style={styles.profilePic}
        />
      </TouchableOpacity>

      {/* Bio Section */}
      {isEditingBio ? (
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={256}
          placeholder="Enter your bio..."
          onBlur={saveBio}
        />
      ) : (
        <TouchableOpacity onPress={() => setIsEditingBio(true)}>
          <Text style={styles.bioText}>{bio || "Tap to add bio"}</Text>
        </TouchableOpacity>
      )}

      {/* Friends Count */}
      <Text style={styles.friendsText}>Friends: 120</Text>

      {/* Posts Grid */}
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            setSelectedImage(item.image);
            setModalVisible(true);
          }}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
          </TouchableOpacity>
        )}
      />

      {/* Modal for Image Preview */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage || "" }} style={styles.fullImage} />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/storyUpload")}>
          <Text style={styles.navButtonText}>📸 Story</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/home")}>
          <Text style={styles.navButtonText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/profile")}>
          <Text style={styles.navButtonText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2B4D66",
    paddingTop: 40,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10,
  },
  bioText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  bioInput: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
  },
  friendsText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  postImage: {
    width: 110,
    height: 110,
    margin: 5,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 16,
    color: "#524A72",
    fontWeight: "bold",
  },
});

