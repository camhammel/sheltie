import { useEffect, useState } from 'react';
import { View, Modal, Text, ScrollView, useWindowDimensions, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';

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

    const getBreedOptions = async (type = 'dog') => {
        const token = storage.getString("token");
        var breedSearch = `types/${type}/breeds`;
  
        return await petfinder
          .get(breedSearch, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            return (response.data.breeds.map((breed) => ({
                label: breed.name,
                value: breed.name,
              })
            ))
          })
          .catch((error) => {});
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
            setBreedOptions(await getBreedOptions(type !== '' ? type : 'Dog'));
        })();
    }, [type])

    return (
        <Modal transparent visible={isVisible}>
            <View
                style={{
                    borderRadius: 15,
                    margin: 20,
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowOffset: { height: 10, width: 10 },
                    shadowRadius: 4,
                    elevation: 5,
                    height: useWindowDimensions().height * 0.85,
                    backgroundColor: "white",
                }}
            >
                <ScrollView>
                    <View
                    style={{
                        display: "flex",
                        height: useWindowDimensions().height * 0.85,
                        flex: 1,
                        justifyContent: "space-evenly",
                    }}
                    >
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
                        <View>
                            <Text style={styles.labelStyle}>AGE</Text>
                            <DropDownPicker
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
                                defaultValue={age}
                                placeholder="Any age"
                                multiple={true}
                                multipleText={age.join(", ")}
                                min={0}
                                max={4}
                                containerStyle={{ height: 40, marginHorizontal: 10 }}
                                style={{ backgroundColor: "#fafafa" }}
                                itemStyle={{
                                    justifyContent: "flex-start",
                                }}
                                dropDownStyle={{
                                    backgroundColor: "#fafafa",
                                    marginBottom: 40,
                                }}
                                onChangeItem={(item) => setAge(item)}
                                isVisible={dropdownVisible == 'age'}
                                onOpen={() => {
                                    setDropdownVisible('age');
                                }}
                                onClose={() => setDropdownVisible('')}
                            />
                        </View>
                        <View>
                            <Text style={styles.labelStyle}>ANIMAL TYPE</Text>
                            <DropDownPicker
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
                                defaultValue={type}
                                containerStyle={{ height: 40, marginHorizontal: 10 }}
                                style={{ backgroundColor: "#fafafa" }}
                                itemStyle={{
                                    justifyContent: "flex-start",
                                }}
                                dropDownStyle={{
                                    backgroundColor: "#fafafa",
                                }}
                                onChangeItem={(item) => {
                                    setType(item.value);
                                }}
                                isVisible={dropdownVisible == 'type'}
                                onOpen={() => {
                                    setDropdownVisible('type');
                                }}
                                onClose={() => setDropdownVisible('')}
                            />
                        </View>
                        <View>
                            <Text style={styles.labelStyle}>ANIMAL BREEDS</Text>
                            <DropDownPicker
                                items={breedOptions.length ? breedOptions : [{ label: 'Fetching Breeds...', value: 'Fetching Breeds...'}]}
                                defaultValue={breed ? breed : ""}
                                placeholder="Any breed"
                                multiple={true}
                                multipleText={breed.join(", ")}
                                min={0}
                                max={100}
                                containerStyle={{ height: 40, marginHorizontal: 10 }}
                                style={{ backgroundColor: "#fafafa" }}
                                itemStyle={{
                                    justifyContent: "flex-start",
                                }}
                                dropDownStyle={{
                                    backgroundColor: "#fafafa",
                                    marginBottom: 40,
                                }}
                                onChangeItem={(item) => setBreed(item)}
                                isVisible={dropdownVisible == 'breed'}
                                onOpen={() => {
                                    setDropdownVisible('breed');
                                }}
                                onClose={() => setDropdownVisible('')}
                            />
                        </View>
                        <View>
                            <Button
                                title="Clear Filters"
                                onPress={() => {
                                    setCustomLocation("");
                                    setDistance(150);
                                    setBreed([]);
                                    setAge([]);
                                    setType("Dog");
                                }}
                                containerStyle={{
                                    marginTop: 20,
                                    marginHorizontal: 20,
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
                                    marginTop: 20,
                                    marginBottom: 20,
                                    marginHorizontal: 20,
                                }}
                                buttonStyle={{
                                    borderRadius: 15,
                                    backgroundColor: COLORS.primary,
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
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
})