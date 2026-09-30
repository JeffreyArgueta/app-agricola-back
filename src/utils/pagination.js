// Utilidad de paginación por offset (tablas pequeñas / admin).
// Calcula el bloque pagination de la respuesta a partir del total.
export const buildPagination = (total, limit, offset) => {
  // Total de páginas y página actual (base 1).
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
  return {
    total,
    limit,
    offset,
    currentPage,
    totalPages,
    // Indica si hay página siguiente / anterior para el cliente.
    hasNextPage: offset + limit < total,
    hasPrevPage: offset > 0,
  };
};
