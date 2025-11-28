from decimal import Decimal


def calculate_expected_amount(
    slots: int,
    package_type: str,
    delivery_option: str,
    basic_slot_price: Decimal,
    standard_slot_price: Decimal,
    monthly_slot_price: Decimal,
    delivery_fee: Decimal
) -> Decimal:
    """
    Calculates the expected payment amount for a booking based on package type,
    number of slots, and delivery option.
    """
    if package_type == 'basic':
        slot_price = basic_slot_price
    elif package_type == 'standard':
        slot_price = standard_slot_price
    elif package_type == 'monthly':
        slot_price = monthly_slot_price
    else:
        raise ValueError("Invalid package_type provided.")

    # Calculate base amount for slots (assuming no per-slot discount like before)
    # If there was a discount per slot after the first, that logic would go here.
    base_amount = slots * slot_price

    total_amount = base_amount

    # Add delivery fee if delivery option is selected
    if delivery_option == 'delivery':
        total_amount += delivery_fee

    return total_amount
