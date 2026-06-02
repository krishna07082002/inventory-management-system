from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    quantity_in_stock: int = Field(ge=0)

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True