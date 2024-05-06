import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_STAFFS = gql`
  query Data(
    $where: StaffWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    queryStaffs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        addProfile
        firstname
        lastname
        username
        gender
        email
        phone
        birthday
        position
        address
        country
        district
        village
        role {
          _id
        }
        status
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_ROLE_STAFFS = gql`
  query Data(
    $where: Role_staffWhereInput
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByFolderAndFileInput
  ) {
    role_staffs(
      where: $where
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
    ) {
      data {
        _id
        name
        permision {
          name
          groupName
          _id
        }
      }
      total
    }
  }
`;

const usePermission = (staffId) => {
  const [permission, setPermission] = useState({
    hasPermission: () => undefined,
  });

  const [getRoleStaffs] = useLazyQuery(GET_ROLE_STAFFS, {
    fetchPolicy: "no-cache",
  });
  const [getStaffs] = useLazyQuery(GET_STAFFS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (staffId) {
      getStaffs({
        variables: {
          where: {
            _id: staffId,
          },
        },
        onCompleted: async (data) => {
          const roleId = data?.queryStaffs?.data?.[0].role?._id;
          if (roleId) {
            const roleStaff = (
              await getRoleStaffs({
                variables: {
                  where: {
                    _id: parseInt(roleId),
                  },
                },
              })
            )?.data?.role_staffs?.data?.[0]?.permision;

            setPermission(() => {
              return {
                hasPermission: (permission) => {
                  return (
                    roleStaff?.filter((userPermission) => {
                      return Array.isArray(permission)
                        ? permission.includes(
                            `${userPermission.groupName}_${userPermission.name}`,
                          )
                        : permission ===
                            `${userPermission.groupName}_${userPermission.name}`;
                    }).length > 0
                  );
                },
              };
            });
          }
        },
      });
    }
  }, [staffId]);

  return {
    hasPermission: permission?.hasPermission,
  };
};

export default usePermission;

/* const permission = usePermission(26 //staffId);
  permission.hasPermission(["file_view"] //permission name from permissions_staff table); */
