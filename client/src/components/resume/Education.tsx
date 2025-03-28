import { useEffect } from "react";
// ...existing code...

export default function Education({ data, onUpdate }: EducationProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const form = useForm<EducationEntry>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (editIndex !== null) {
      form.reset(data[editIndex]);
    } else {
      form.reset({
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [editIndex, data, form]);

  const onSubmit = (values: EducationEntry) => {
    const newData = [...data];
    if (editIndex !== null) {
      newData[editIndex] = values;
    } else {
      newData.push(values);
    }
    onUpdate(newData);
    setEditIndex(null);
    form.reset();
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.map((entry, index) => (
          <Card key={entry.school + index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{entry.school}</h3>
                  <p className="text-sm text-muted-foreground">
                    {entry.degree} in {entry.field}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.startDate} - {entry.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Input placeholder="University Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="Bachelor's" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">
            {editIndex !== null ? (
              "Update Education"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}