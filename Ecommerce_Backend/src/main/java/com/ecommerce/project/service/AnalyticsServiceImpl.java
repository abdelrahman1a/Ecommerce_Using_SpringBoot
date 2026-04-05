package com.ecommerce.project.service;

import com.ecommerce.project.payload.AnalyticsResponse;
import com.ecommerce.project.repository.OrderRepository;
import com.ecommerce.project.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private OrderRepository orderRepository;


    @Override
    public AnalyticsResponse getAnalyticsData() {

        AnalyticsResponse response = new AnalyticsResponse();

        Long totalProducts = productRepo.count();
        Double totalRevenue = orderRepository.getTotalRevenue();
        long totalOrders = orderRepository.count();

        response.setProductsCount(String.valueOf(totalProducts));
        response.setTotalOrders(String.valueOf(totalOrders));
        response.setTotalRevenue(String.valueOf(totalRevenue != null ? totalRevenue : 0));


        return response;
    }
}
