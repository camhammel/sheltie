import { useEffect, useState } from 'react';
import { View, Modal, Text, useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import petfinder from '../api/petfinder';
import MySlider from './MySlider';
import { storage } from '../utils/storage';
import { COLORS } from '../assets/colors';

export default SearchModal = (props) => {
    const { isVisible, onSaveChanges } = props;

    const lastsearchstr = storage.getString('lastsearch');
    const lastsearch = JSON.parse(lastsearchstr || null);

    const [dropdownVisible, setDropdownVisible] = useState('');
    const [customLocation, setCustomLocation] = useState('');

    const [distance, setDistance] = useState(lastsearch?.distance || 150);
    const [age, setAge] = useState([]);
    const [type, setType] = useState('Dog');
    const [breed, setBreed] = useState([]);
    const [breedOptions, setBreedOptions] = useState([]);

    const getBreedOptions = (type = 'dog') => {
        var breedSearch = `types/${type}/breeds`;
        return petfinder.get(breedSearch)
          .then((response) => {
            return (response?.data?.breeds?.map((breed) => ({
                label: breed.name,
                value: breed.name,
              })
            ))
          })
          .catch((error) => {
            console.log('could not get breeds', error);
          });
    };

    const compileFilters = () => {
        return {
            customLocation,
            distance,
            age,
            type,
            breed
        }
    }

    useEffect(() => {
        (async () => {
            const options = await getBreedOptions(type !== '' ? type : 'Dog')
            setBreedOptions(options);
        })();
    }, [type])

    return (
        <Modal transparent visible={isVisible}>
            <SafeAreaProvider>
                <View style={styles.backdrop}>
                    <SafeAreaView>
                        <View style={{ 
                            padding: 16,
                            borderRadius: 15,
                            margin: 16,
                            shadowColor: '#000',
                            shadowOpacity: 0.25,
                            shadowOffset: { height: 10, width: 10 },
                            shadowRadius: 4,
                            display: 'flex',
                            maxHeight: useWindowDimensions().height * 0.85,
                            elevation: 5,
                            backgroundColor: "white",
                        }}>
                            <View>
                                <Text style={styles.labelStyle}>LOCATION</Text>
                                <Input
                                    inputStyle={{
                                        marginLeft: 10,
                                        marginTop: 0,
                                        marginBottom: 0,
                                        fontSize: 18,
                                        color: COLORS.darkgrey,
                                    }}
                                    inputContainerStyle={styles.inputContainerStyle}
                                    placeholder="Use Current Location"
                                    leftIcon={{
                                        type: "font-awesome",
                                        name: "globe",
                                        color: COLORS.primary,
                                    }}
                                    leftIconContainerStyle={{ marginLeft: 10 }}
                                    defaultValue={customLocation ? customLocation : ""}
                                    textContentType="addressCityAndState"
                                    clearButtonMode="always"
                                    onChangeText={(text) => {
                                        setCustomLocation(text);
                                    }}
                                    errorStyle={{
                                        marginLeft: 15,
                                        marginBottom: 10,
                                    }}
                                    value={customLocation}
                                />
                            </View>
                            <View>
                                <MySlider distance={distance} setDistance={setDistance} />
                            </View>
                            <View style={{zIndex: dropdownVisible == 'type' ? 1: 0 }}>
                                <Text style={styles.labelStyle}>TYPE</Text>
                                <DropDownPicker
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                    items={[
                                        {
                                        label: "Dog",
                                        value: "Dog",
                                        },
                                        {
                                        label: "Cat",
                                        value: "Cat",
                                        },
                                        {
                                        label: "Bird",
                                        value: "Bird",
                                        },
                                    ]}
                                    value={type}
                                    onSelectItem={(item) => { setType(item.value); }}
                                    open={dropdownVisible == 'type'}
                                    onOpen={() => {
                                        setDropdownVisible('type');
                                    }}
                                    onClose={() => setDropdownVisible('')}
                                />
                            </View>
                            <View style={{zIndex: dropdownVisible == 'age' ? 1: 0 }}>
                                <Text style={styles.labelStyle}>AGE</Text>
                                <DropDownPicker
                                    zIndex={2000}
                                    zIndexInverse={2000}
                                    items={[
                                        {
                                        label: "Baby",
                                        value: "Baby",
                                        },
                                        {
                                        label: "Young",
                                        value: "Young",
                                        },
                                        {
                                        label: "Adult",
                                        value: "Adult",
                                        },
                                        {
                                        label: "Senior",
                                        value: "Senior",
                                        },
                                    ]}
                                    value={age}
                                    mode="BADGE"
                                    showBadgeDot={false}
                                    placeholder="Any age"
                                    multiple={true}
                                    multipleText={age.join(", ")}
                                    min={0}
                                    max={4}
                                    onSelectItem={(item) => { 
                                        setAge(item.map((option) => option.value));
                                    }}
                                    open={dropdownVisible == 'age'}
                                    onOpen={() => {
                                        setDropdownVisible('age');
                                    }}
                                    onClose={() => setDropdownVisible('')}
                                />
                            </View>
                            <View style={{zIndex: dropdownVisible == 'breed' ? 1: 0 }}>
                                <Text style={styles.labelStyle}>BREED</Text>
                                <DropDownPicker
                                    zIndex={1000}
                                    zIndexInverse={3000}
                                    items={breedOptions && breedOptions.length ? breedOptions : [{ label: 'Fetching Breeds...', value: 'Fetching Breeds...'}]}
                                    value={breed ? breed : ""}
                                    placeholder="Any breed"
                                    multiple={true}
                                    mode="BADGE"
                                    searchable={Platform.OS === 'android'}
                                    showBadgeDot={false}
                                    min={0}
                                    max={5}
                                    onSelectItem={(item) => { setBreed(item.map((option) => option.value)); }}
                                    open={dropdownVisible == 'breed'}
                                    onOpen={() => {
                                        setDropdownVisible('breed');
                                    }}
                                    listMode={Platform.OS === 'android' ? "MODAL" : "SCROLLVIEW"}
                                    onClose={() => setDropdownVisible('')}
                                />
                            </View>
                            <View style={{ paddingVertical: 32 }}>
                                <Button
                                    title="Clear Filters"
                                    onPress={() => {
                                        setCustomLocation("");
                                        setDistance(150);
                                        setAge([]);
                                        setBreed([]);
                                        setType("Dog");
                                    }}
                                    buttonStyle={{
                                        borderRadius: 15,
                                        backgroundColor: "grey",
                                    }}
                                />
                                <Button
                                    title="Search"
                                    onPress={() => {
                                        onSaveChanges(compileFilters());
                                    }}
                                    containerStyle={{
                                        marginTop: 16
                                    }}
                                    buttonStyle={{
                                        borderRadius: 15,
                                        backgroundColor: COLORS.primary,
                                    }}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </SafeAreaProvider>
        </Modal>
    )
}

const styles = StyleSheet.create({
    labelStyle: {
        fontWeight: "bold",
        fontSize: 20,
        color: COLORS.primary,
        marginLeft: 15,
        marginBottom: 5,
        marginTop: 20,
      },
      inputStyle: {
        borderRadius: 8,
        paddingHorizontal: 10,
        color: COLORS.darkgrey,
      },
      inputContainerStyle: {
        borderRadius: 8,
        borderBottomWidth: 0,
      },
      inputLabelStyle: {
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 5,
      },
      backdrop: {
        display: 'flex', 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }
})