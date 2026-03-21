import json
# Function to write list of dictionaries to JSON file
def write_data(data_list,path):
    """
    filename: name of the json file
    data_list: list of dictionaries
    """
    with open(path, "w") as file:
        json.dump(data_list, file, indent=4)
    print("Data written successfully!")


# Function to read list of dictionaries from JSON file
def read_data(path):
    """
    filename: name of the json file
    returns: list of dictionaries
    """

    with open(path, "r") as file:
        data = json.load(file)
    print("Data read successfully!")
    return data
