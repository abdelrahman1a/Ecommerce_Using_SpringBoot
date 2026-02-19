package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourseNotFoundException;
import com.ecommerce.project.model.Address;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.repository.AddressRepository;
import com.ecommerce.project.utils.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    AuthUtil authUtil;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {

        Address address = modelMapper.map(addressDTO, Address.class);
        address.setUser(user);
        List<Address> listAddresses = user.getAddresses();
        listAddresses.add(address);
        user.setAddresses(listAddresses);
        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAllAddressDTO() {
        List<Address> addresses = addressRepository.findAll();

        List<AddressDTO> addressDTOS = addresses.stream().map(a -> modelMapper.map(a, AddressDTO.class)).collect(Collectors.toList());
        return addressDTOS;
    }

    @Override
    public AddressDTO getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourseNotFoundException("Address", "addressId", addressId));
        AddressDTO addressDTO = modelMapper.map(address, AddressDTO.class);
        return addressDTO;
    }

    @Override
    public List<AddressDTO> getAddressesByUser(User user) {
        List<Address> addresses = user.getAddresses();

        List<AddressDTO> addressDTOS = addresses.stream().map(a -> modelMapper.map(a, AddressDTO.class)).toList();
        return addressDTOS;
    }

    @Override
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        // 1 - get address
        Address addressFromDataBase = addressRepository.findById(addressId).orElseThrow(() -> new ResourseNotFoundException("Address", "addressId", addressId));
        // - set fields updated
        addressFromDataBase.setCity(addressDTO.getCity());
        addressFromDataBase.setCountry(addressDTO.getCountry());
        addressFromDataBase.setStreet(addressDTO.getStreet());
        addressFromDataBase.setState(addressDTO.getState());
        addressFromDataBase.setPincode(addressDTO.getPincode());
        addressFromDataBase.setBuildingName(addressDTO.getBuildingName());

        // 3 - save and return updated
        Address updatedAddress = addressRepository.save(addressFromDataBase);

        return modelMapper.map(updatedAddress, AddressDTO.class);

    }

    @Override
    public String deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId).orElseThrow(() -> new ResourseNotFoundException("Address", "addressId", addressId));
        addressRepository.deleteById(addressId);
        return "Address Deleted Successfully with AddressId: " + addressId;
    }
}
